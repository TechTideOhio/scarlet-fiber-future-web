import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logError } from '@/lib/errorLogger';

interface Props {
  children: ReactNode;
  pageName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(error, {
      component: 'PageErrorBoundary',
      action: 'page_crash',
      additionalData: {
        pageName: this.props.pageName,
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleGoBack = (): void => {
    window.history.back();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-8">
          <div className="max-w-sm w-full text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                This page couldn't load
              </h2>
              <p className="text-sm text-muted-foreground">
                There was a problem loading this content. Please try again.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-muted p-3 rounded text-left">
                <p className="text-xs font-mono text-destructive">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleGoBack}
                className="gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Go Back
              </Button>
              <Button
                size="sm"
                onClick={this.handleRetry}
                className="gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
