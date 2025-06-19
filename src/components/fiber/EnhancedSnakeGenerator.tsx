
import React from 'react';

export interface EnhancedSnakeNode {
  x: number;
  y: number;
  id: string;
  isActive: boolean;
  intensity: number;
  pulsePhase: number;
  connectionStrength: number;
}

export interface EnhancedSnakePath {
  id: string;
  nodes: EnhancedSnakeNode[];
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'curved';
  speed: number;
  color: string;
  width: number;
  activeSegmentIndex: number;
  segmentLength: number;
  pathType: 'main' | 'branch' | 'connection';
  layer: number;
  opacity: number;
  glowIntensity: number;
}

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
    const colors = [
      'rgba(255, 50, 50, 0.9)',
      'rgba(255, 100, 100, 0.8)',
      'rgba(220, 30, 30, 0.7)',
      'rgba(187, 0, 0, 0.8)',
      'rgba(255, 80, 80, 0.6)',
      'rgba(200, 20, 20, 0.75)'
    ];

    // Generate main network paths
    for (let i = 0; i < Math.floor(pathCount * 0.6); i++) {
      const path = this.createMainNetworkPath(i, colors[i % colors.length]);
      paths.push(path);
    }

    // Generate connecting branches
    for (let i = Math.floor(pathCount * 0.6); i < pathCount; i++) {
      const path = this.createBranchPath(i, colors[i % colors.length]);
      paths.push(path);
    }

    return paths;
  }

  private createMainNetworkPath(index: number, color: string): EnhancedSnakePath {
    const nodes: EnhancedSnakeNode[] = [];
    const segmentLength = this.isMobile ? 10 : 15;
    const pathType = Math.random() < 0.7 ? 'horizontal' : 'curved';
    
    if (pathType === 'horizontal') {
      const y = (this.containerHeight / 8) * (1 + (index % 6));
      const nodeCount = Math.floor(this.containerWidth / (this.isMobile ? 50 : 70));
      
      for (let i = 0; i < nodeCount; i++) {
        const progress = i / (nodeCount - 1);
        const x = progress * this.containerWidth;
        
        // Add organic wave motion
        const waveOffset = Math.sin(progress * Math.PI * 3 + index * 0.5) * (this.isMobile ? 25 : 50);
        const finalY = y + waveOffset;
        
        nodes.push({
          id: `main-node-${index}-${i}`,
          x: Math.max(0, Math.min(this.containerWidth, x)),
          y: Math.max(0, Math.min(this.containerHeight, finalY)),
          isActive: false,
          intensity: 0,
          pulsePhase: Math.random() * Math.PI * 2,
          connectionStrength: 0.8 + Math.random() * 0.2
        });
      }
    } else {
      // Curved diagonal paths
      const startX = Math.random() * this.containerWidth * 0.2;
      const endX = this.containerWidth * 0.8 + Math.random() * this.containerWidth * 0.2;
      const nodeCount = Math.floor(Math.abs(endX - startX) / (this.isMobile ? 60 : 80));
      
      for (let i = 0; i < nodeCount; i++) {
        const progress = i / (nodeCount - 1);
        const x = startX + (endX - startX) * progress;
        
        // Create bezier-like curve
        const curveHeight = this.containerHeight * 0.3;
        const y = curveHeight + Math.sin(progress * Math.PI) * curveHeight;
        
        nodes.push({
          id: `curved-node-${index}-${i}`,
          x: Math.max(0, Math.min(this.containerWidth, x)),
          y: Math.max(0, Math.min(this.containerHeight, y)),
          isActive: false,
          intensity: 0,
          pulsePhase: Math.random() * Math.PI * 2,
          connectionStrength: 0.7 + Math.random() * 0.3
        });
      }
    }

    return {
      id: `enhanced-path-${index}`,
      nodes,
      direction: pathType === 'horizontal' ? 'horizontal' : 'curved',
      speed: 0.8 + Math.random() * 1.2,
      color,
      width: this.isMobile ? 4 : 6,
      activeSegmentIndex: Math.random() * nodes.length,
      segmentLength,
      pathType: 'main',
      layer: index % 3,
      opacity: 0.8 + Math.random() * 0.2,
      glowIntensity: 0.6 + Math.random() * 0.4
    };
  }

  private createBranchPath(index: number, color: string): EnhancedSnakePath {
    const nodes: EnhancedSnakeNode[] = [];
    const nodeCount = this.isMobile ? 8 : 12;
    
    // Create shorter connecting paths
    const startX = Math.random() * this.containerWidth;
    const startY = Math.random() * this.containerHeight;
    const angle = Math.random() * Math.PI * 2;
    const length = this.isMobile ? 150 : 250;
    
    for (let i = 0; i < nodeCount; i++) {
      const progress = i / (nodeCount - 1);
      const x = startX + Math.cos(angle) * length * progress;
      const y = startY + Math.sin(angle) * length * progress;
      
      nodes.push({
        id: `branch-node-${index}-${i}`,
        x: Math.max(0, Math.min(this.containerWidth, x)),
        y: Math.max(0, Math.min(this.containerHeight, y)),
        isActive: false,
        intensity: 0,
        pulsePhase: Math.random() * Math.PI * 2,
        connectionStrength: 0.5 + Math.random() * 0.3
      });
    }

    return {
      id: `branch-path-${index}`,
      nodes,
      direction: 'diagonal',
      speed: 1.2 + Math.random() * 0.8,
      color,
      width: this.isMobile ? 2 : 3,
      activeSegmentIndex: 0,
      segmentLength: this.isMobile ? 6 : 8,
      pathType: 'branch',
      layer: (index % 2) + 1,
      opacity: 0.6 + Math.random() * 0.3,
      glowIntensity: 0.4 + Math.random() * 0.3
    };
  }

  updateEnhancedPath(path: EnhancedSnakePath, deltaTime: number, heroGlowIntensity: number = 0): EnhancedSnakePath {
    this.time += deltaTime * 0.001;
    const newPath = { ...path };
    
    // Enhanced animation speed based on path type
    const speedMultiplier = path.pathType === 'main' ? 1 : 1.5;
    newPath.activeSegmentIndex += path.speed * speedMultiplier * deltaTime * 0.08;
    
    // Reset when reaching the end
    if (newPath.activeSegmentIndex >= path.nodes.length) {
      newPath.activeSegmentIndex = 0;
    }

    // Update nodes with enhanced effects
    newPath.nodes = path.nodes.map((node, index) => {
      const distanceFromActive = Math.abs(index - newPath.activeSegmentIndex);
      const isInSegment = distanceFromActive < path.segmentLength;
      
      // Calculate intensity with pulse effects
      let intensity = 0;
      if (isInSegment) {
        const baseIntensity = Math.max(0, 1 - (distanceFromActive / path.segmentLength));
        const pulseEffect = Math.sin(this.time * 2 + node.pulsePhase) * 0.3 + 0.7;
        intensity = baseIntensity * pulseEffect * node.connectionStrength;
        
        // Hero synchronization effect
        intensity += heroGlowIntensity * 0.3;
      }
      
      return {
        ...node,
        isActive: isInSegment,
        intensity: Math.min(intensity, 1)
      };
    });

    // Dynamic opacity based on hero sync
    newPath.opacity = path.opacity + heroGlowIntensity * 0.2;
    newPath.glowIntensity = path.glowIntensity + heroGlowIntensity * 0.4;

    return newPath;
  }
}

export default EnhancedSnakeGenerator;
