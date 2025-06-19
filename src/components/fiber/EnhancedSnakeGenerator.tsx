
import React from 'react';
import { EnhancedSnakePath, PathGenerationConfig } from './types/snakeTypes';
import { 
  createMainNetworkPath, 
  createBranchPath, 
  getDefaultColors 
} from './utils/pathGeneration';
import { 
  updatePathNodes, 
  calculateNextSegmentIndex, 
  updatePathProperties 
} from './utils/pathUpdater';

// Re-export types for backward compatibility
export type { EnhancedSnakeNode, EnhancedSnakePath } from './types/snakeTypes';

export class EnhancedSnakeGenerator {
  private containerWidth: number;
  private containerHeight: number;
  private isMobile: boolean;
  private time: number = 0;

  constructor(containerWidth: number, containerHeight: number, isMobile: boolean = false) {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.isMobile = isMobile;
  }

  generateEnhancedPaths(pathCount: number): EnhancedSnakePath[] {
    const paths: EnhancedSnakePath[] = [];
    const colors = getDefaultColors();
    
    const config: PathGenerationConfig = {
      containerWidth: this.containerWidth,
      containerHeight: this.containerHeight,
      isMobile: this.isMobile,
      pathCount,
      colors
    };

    // Generate main network paths
    for (let i = 0; i < Math.floor(pathCount * 0.6); i++) {
      const path = createMainNetworkPath(i, colors[i % colors.length], config);
      paths.push(path);
    }

    // Generate connecting branches
    for (let i = Math.floor(pathCount * 0.6); i < pathCount; i++) {
      const path = createBranchPath(i, colors[i % colors.length], config);
      paths.push(path);
    }

    return paths;
  }

  updateEnhancedPath(path: EnhancedSnakePath, deltaTime: number, heroGlowIntensity: number = 0): EnhancedSnakePath {
    this.time += deltaTime * 0.001;
    
    // Calculate next segment index
    const nextSegmentIndex = calculateNextSegmentIndex(
      path.activeSegmentIndex,
      path.speed,
      path.pathType,
      deltaTime,
      path.nodes.length
    );
    
    // Update nodes
    const updatedNodes = updatePathNodes(path, nextSegmentIndex, this.time, heroGlowIntensity);
    
    // Update path properties
    const { opacity, glowIntensity } = updatePathProperties(path, heroGlowIntensity);

    return {
      ...path,
      activeSegmentIndex: nextSegmentIndex,
      nodes: updatedNodes,
      opacity,
      glowIntensity
    };
  }
}

export default EnhancedSnakeGenerator;
