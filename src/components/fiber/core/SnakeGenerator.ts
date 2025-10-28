
import { EnhancedSnakePath, PathGenerationConfig } from '../types/snakeTypes';
import { 
  createMainNetworkPath, 
  createBranchPath, 
  getDefaultColors 
} from '../utils/pathGeneration';
import { 
  updatePathNodes, 
  calculateNextSegmentIndex, 
  updatePathProperties 
} from '../utils/pathUpdater';
import { FIBER_ANIMATION_TOKENS, logFiberToken } from '../../../constants';

export class SnakeGenerator {
  private containerWidth: number;
  private containerHeight: number;
  private isMobile: boolean;
  private time: number = 0;

  constructor(containerWidth: number, containerHeight: number, isMobile: boolean = false) {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.isMobile = isMobile;
    
    console.log('SnakeGenerator created:', { containerWidth, containerHeight, isMobile });
  }

  generateEnhancedPaths(pathCount: number): EnhancedSnakePath[] {
    console.log('Generating enhanced paths:', pathCount);
    
    if (pathCount <= 0 || this.containerWidth <= 0 || this.containerHeight <= 0) {
      console.warn('Invalid parameters for path generation:', { pathCount, width: this.containerWidth, height: this.containerHeight });
      return [];
    }

    const paths: EnhancedSnakePath[] = [];
    const colors = getDefaultColors();
    
    const config: PathGenerationConfig = {
      containerWidth: this.containerWidth,
      containerHeight: this.containerHeight,
      isMobile: this.isMobile,
      pathCount,
      colors
    };

    // CRITICAL FIX: Ensure deterministic path generation with proper spacing
    const mainPathCount = Math.max(Math.floor(pathCount * 0.7), 1);
    const branchPathCount = pathCount - mainPathCount;

    console.log('Path distribution:', { mainPathCount, branchPathCount });

    // Generate main network paths with fixed positions
    for (let i = 0; i < mainPathCount; i++) {
      try {
        const path = createMainNetworkPath(i, colors[i % colors.length], config);
        // CRITICAL FIX: Start with deterministic positions instead of random
        path.activeSegmentIndex = (i * 3) % Math.max(path.nodes.length - path.segmentLength, 1);
        paths.push(path);
        console.log(`Generated main path ${i}:`, { 
          nodeCount: path.nodes.length, 
          activeSegmentIndex: path.activeSegmentIndex,
          segmentLength: path.segmentLength 
        });
      } catch (error) {
        console.error(`Failed to create main path ${i}:`, error);
      }
    }

    // Generate connecting branches
    for (let i = 0; i < branchPathCount; i++) {
      try {
        const path = createBranchPath(mainPathCount + i, colors[(mainPathCount + i) % colors.length], config);
        // Start branches at different positions
        path.activeSegmentIndex = (i * 2) % Math.max(path.nodes.length - path.segmentLength, 1);
        paths.push(path);
        console.log(`Generated branch path ${i}:`, { 
          nodeCount: path.nodes.length, 
          activeSegmentIndex: path.activeSegmentIndex 
        });
      } catch (error) {
        console.error(`Failed to create branch path ${i}:`, error);
      }
    }

    console.log(`Total paths generated: ${paths.length}`);
    return paths;
  }

  updateEnhancedPath(path: EnhancedSnakePath, deltaTime: number, heroGlowIntensity: number = 0): EnhancedSnakePath {
    this.time += deltaTime;
    
    if (!path.nodes || path.nodes.length === 0) {
      console.warn('Attempted to update path with no nodes');
      return path;
    }
    
    try {
      // CRITICAL FIX: Calculate next segment with proper time delta
      const nextSegmentIndex = calculateNextSegmentIndex(
        path.activeSegmentIndex,
        path.speed,
        path.pathType,
        deltaTime,
        path.nodes.length
      );
      
      // CRITICAL FIX: Update nodes with guaranteed visibility
      const updatedNodes = updatePathNodes(path, Math.floor(nextSegmentIndex), this.time, heroGlowIntensity);
      
      // CRITICAL FIX: Update path properties for better visibility
      const { opacity, glowIntensity } = updatePathProperties(path, heroGlowIntensity);
      
      // Enhanced visibility
      const enhancedOpacity = Math.max(opacity, FIBER_ANIMATION_TOKENS.opacity.container.min);
      const enhancedGlow = Math.max(glowIntensity, FIBER_ANIMATION_TOKENS.glow.min);
      
      return {
        ...path,
        nodes: updatedNodes,
        activeSegmentIndex: nextSegmentIndex,
        opacity: enhancedOpacity,
        glowIntensity: enhancedGlow
      };
    } catch (error) {
      console.error('Error updating path:', error);
      return path;
    }
  }
}
