
import React from 'react';

export interface SnakeNode {
  x: number;
  y: number;
  id: string;
  isActive: boolean;
  intensity: number;
}

export interface SnakePath {
  id: string;
  nodes: SnakeNode[];
  direction: 'horizontal' | 'vertical' | 'diagonal';
  speed: number;
  color: string;
  width: number;
  activeSegmentIndex: number;
  segmentLength: number;
}

interface SnakePathGeneratorProps {
  containerWidth: number;
  containerHeight: number;
  pathCount: number;
  isMobile: boolean;
}

export class SnakePathGenerator {
  private containerWidth: number;
  private containerHeight: number;
  private isMobile: boolean;

  constructor(containerWidth: number, containerHeight: number, isMobile: boolean = false) {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.isMobile = isMobile;
  }

  generateNetworkPaths(pathCount: number): SnakePath[] {
    const paths: SnakePath[] = [];
    const colors = [
      'rgba(255, 50, 50, 0.9)',
      'rgba(255, 100, 100, 0.8)',
      'rgba(220, 30, 30, 0.7)',
      'rgba(187, 0, 0, 0.8)',
      'rgba(255, 80, 80, 0.6)'
    ];

    for (let i = 0; i < pathCount; i++) {
      const pathType = Math.random() < 0.6 ? 'horizontal' : 'vertical';
      const path = this.createNetworkPath(i, pathType, colors[i % colors.length]);
      paths.push(path);
    }

    return paths;
  }

  private createNetworkPath(index: number, direction: 'horizontal' | 'vertical', color: string): SnakePath {
    const nodes: SnakeNode[] = [];
    const segmentLength = this.isMobile ? 8 : 12;
    
    if (direction === 'horizontal') {
      // Create horizontal network paths across the screen
      const y = (this.containerHeight / 6) * (1 + (index % 4));
      const nodeCount = Math.floor(this.containerWidth / (this.isMobile ? 60 : 80));
      
      for (let i = 0; i < nodeCount; i++) {
        const x = (i * this.containerWidth) / nodeCount + Math.random() * 40 - 20;
        const yOffset = Math.sin(i * 0.5) * (this.isMobile ? 20 : 40);
        
        nodes.push({
          id: `node-${index}-${i}`,
          x: Math.max(0, Math.min(this.containerWidth, x)),
          y: Math.max(0, Math.min(this.containerHeight, y + yOffset)),
          isActive: false,
          intensity: 0
        });
      }
    } else {
      // Create vertical network paths
      const x = (this.containerWidth / 5) * (1 + (index % 3));
      const nodeCount = Math.floor(this.containerHeight / (this.isMobile ? 80 : 100));
      
      for (let i = 0; i < nodeCount; i++) {
        const y = (i * this.containerHeight) / nodeCount;
        const xOffset = Math.sin(i * 0.3) * (this.isMobile ? 30 : 60);
        
        nodes.push({
          id: `node-${index}-${i}`,
          x: Math.max(0, Math.min(this.containerWidth, x + xOffset)),
          y: Math.max(0, Math.min(this.containerHeight, y)),
          isActive: false,
          intensity: 0
        });
      }
    }

    return {
      id: `snake-path-${index}`,
      nodes,
      direction,
      speed: 0.5 + Math.random() * 1.5,
      color,
      width: this.isMobile ? 3 : 5,
      activeSegmentIndex: 0,
      segmentLength
    };
  }

  updatePathAnimation(path: SnakePath, deltaTime: number): SnakePath {
    const newPath = { ...path };
    
    // Move the active segment along the path
    newPath.activeSegmentIndex += path.speed * deltaTime * 0.1;
    
    // Reset when reaching the end
    if (newPath.activeSegmentIndex >= path.nodes.length) {
      newPath.activeSegmentIndex = 0;
    }

    // Update node states based on active segment
    newPath.nodes = path.nodes.map((node, index) => {
      const distanceFromActive = Math.abs(index - newPath.activeSegmentIndex);
      const isInSegment = distanceFromActive < path.segmentLength;
      
      return {
        ...node,
        isActive: isInSegment,
        intensity: isInSegment ? Math.max(0, 1 - (distanceFromActive / path.segmentLength)) : 0
      };
    });

    return newPath;
  }
}

// React component wrapper
const SnakePathGeneratorComponent: React.FC<SnakePathGeneratorProps> = ({ 
  containerWidth, 
  containerHeight, 
  pathCount, 
  isMobile 
}) => {
  return null; // This is a utility component, no render needed
};

export default SnakePathGeneratorComponent;
