
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
    // CRITICAL FIX: Use consistent time accumulation
    this.time += deltaTime * 0.001;
    
    // Calculate next segment index with proper bounds checking
    const nextSegmentIndex = calculateNextSegmentIndex(
      path.activeSegmentIndex,
      path.speed,
      path.pathType,
      deltaTime,
      path.nodes.length
    );
    
    // Update nodes with active segment
    const updatedNodes = updatePathNodes(path, Math.floor(nextSegmentIndex), this.time, heroGlowIntensity);
    
    // Update path properties
    const { opacity, glowIntensity } = updatePathProperties(path, heroGlowIntensity);

    // Debug active nodes count
    const activeNodeCount = updatedNodes.filter(n => n.isActive && n.intensity > 0).length;
    if (activeNodeCount === 0) {
      console.warn(`Path ${path.id} has no active nodes:`, {
        activeSegmentIndex: nextSegmentIndex,
        nodeCount: path.nodes.length,
        segmentLength: path.segmentLength
      });
    }

    return {
      ...path,
      activeSegmentIndex: nextSegmentIndex,
      nodes: updatedNodes,
      opacity: Math.max(opacity, 0.6), // Ensure minimum visibility
      glowIntensity: Math.max(glowIntensity, 0.5) // Ensure minimum glow
    };
  }
}
