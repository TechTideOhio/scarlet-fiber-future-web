import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/lib/errorLogger';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  toastTitle?: string;
  retryable?: boolean;
  context?: string;
}

interface ErrorState {
  error: Error | null;
  isError: boolean;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { 
    showToast = true, 
    toastTitle = 'An error occurred',
    retryable = false,
    context = 'unknown'
  } = options;
  
  const { toast } = useToast();
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
  });

  const handleError = useCallback((error: Error | unknown, customContext?: string) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    // Log the error
    logError(errorObj, {
      component: customContext || context,
      action: 'async_error',
    });

    // Update state
    setErrorState({ error: errorObj, isError: true });

    // Show toast if enabled
    if (showToast) {
      toast({
        title: toastTitle,
        description: errorObj.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    }

    return errorObj;
  }, [context, showToast, toast, toastTitle]);

  const clearError = useCallback(() => {
    setErrorState({ error: null, isError: false });
  }, []);

  // Wrapper for async functions with automatic error handling
  const wrapAsync = useCallback(<T,>(
    asyncFn: () => Promise<T>,
    customContext?: string
  ): Promise<T | undefined> => {
    return asyncFn().catch((error) => {
      handleError(error, customContext);
      return undefined;
    });
  }, [handleError]);

  // Retry mechanism for failed operations
  const retry = useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T | undefined> => {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        clearError();
        return await asyncFn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }

    if (lastError) {
      handleError(lastError);
    }
    
    return undefined;
  }, [clearError, handleError]);

  return {
    error: errorState.error,
    isError: errorState.isError,
    handleError,
    clearError,
    wrapAsync,
    retry: retryable ? retry : undefined,
  };
};

export default useErrorHandler;
