
import { useEffect } from 'react';
import { PathInitializationProps } from './types';

export const usePathInitialization = ({
  canvasReady,
  pathGeneratorRef,
  pathCount,
  setRenderError
}: PathInitializationProps) => {
  
  const initializePaths = (initializationAttemptRef: React.MutableRefObject<number>, updateAnimationState: (updates: any) => void) => {
    useEffect(() => {
      if (canvasReady && pathGeneratorRef.current && pathCount > 0) {
        initializationAttemptRef.current++;
        console.log(`Initializing paths attempt ${initializationAttemptRef.current} for pathCount:`, pathCount);
        
        try {
          const generatedPaths = pathGeneratorRef.current.generateEnhancedPaths(pathCount);
          
          if (generatedPaths.length === 0) {
            console.error('CRITICAL: No paths generated!');
            setRenderError('Failed to generate animation paths');
            return;
          }
          
          // CRITICAL FIX: Validate paths have active nodes
          let validPaths = 0;
          generatedPaths.forEach((path, i) => {
            if (path.nodes.length > 0) {
              validPaths++;
              console.log(`Path ${i} validation:`, { 
                nodeCount: path.nodes.length, 
                activeSegmentIndex: path.activeSegmentIndex,
                segmentLength: path.segmentLength,
                pathType: path.pathType
              });
            }
          });
          
          console.log(`Generated ${validPaths}/${generatedPaths.length} valid paths`);
          
          if (validPaths === 0) {
            console.error('CRITICAL: No valid paths generated!');
            setRenderError('All generated paths are invalid');
            return;
          }
          
          updateAnimationState({
            paths: generatedPaths,
            animationStarted: false,
            frameCount: 0
          });
          setRenderError(null);
          
          console.log('Path initialization successful:', {
            totalPaths: generatedPaths.length,
            validPaths,
            canvasReady,
            pathCount
          });
          
        } catch (error) {
          console.error('Path generation error:', error);
          setRenderError(error instanceof Error ? error.message : 'Path generation failed');
        }
      }
    }, [canvasReady, pathCount, pathGeneratorRef, setRenderError]);
  };

  return { initializePaths };
};
