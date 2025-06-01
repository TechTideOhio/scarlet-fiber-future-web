
import { useEffect, useState } from 'react';
import { detectWebGLCapabilities } from '../utils/webglDetection';

interface WebGLState {
  supported: boolean;
  shouldUse: boolean;
  loaded: boolean;
  error: boolean;
}

export const useWebGLState = () => {
  const [webglState, setWebglState] = useState<WebGLState>({
    supported: false,
    shouldUse: false,
    loaded: false,
    error: false
  });

  useEffect(() => {
    const capabilities = detectWebGLCapabilities();
    setWebglState(prev => ({
      ...prev,
      supported: capabilities.webglSupported,
      shouldUse: capabilities.shouldUseWebGL
    }));

    console.log('WebGL Detection:', {
      supported: capabilities.webglSupported,
      score: capabilities.score,
      shouldUseWebGL: capabilities.shouldUseWebGL
    });
  }, []);

  const handleWebGLLoaded = () => {
    setWebglState(prev => ({ ...prev, loaded: true }));
  };

  const handleWebGLError = (error: Error) => {
    console.error('WebGL enhancement failed:', error);
    setWebglState(prev => ({ ...prev, error: true }));
  };

  return {
    webglState,
    handleWebGLLoaded,
    handleWebGLError
  };
};
