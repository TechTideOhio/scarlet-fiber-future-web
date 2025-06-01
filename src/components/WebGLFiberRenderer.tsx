
import React, { useEffect, useRef, useCallback } from 'react';
import { createWebGLScene, handleSceneResize, type SceneSetup } from '../utils/webglScene';
import { createFiberCurve, createFiberGeometry } from '../utils/fiberGeometry';
import { createFiberMaterial } from '../utils/shaderMaterials';
import { createParticleSystem, updateParticlePositions, type ParticleSystemData } from '../utils/particleSystem';

interface WebGLFiberRendererProps {
  onLoaded?: () => void;
  onError?: (error: Error) => void;
  mousePosition: { x: number; y: number };
  isVisible?: boolean;
}

const WebGLFiberRenderer: React.FC<WebGLFiberRendererProps> = ({
  onLoaded,
  onError,
  mousePosition,
  isVisible = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneSetupRef = useRef<SceneSetup | null>(null);
  const fibersRef = useRef<any[]>([]);
  const particlesRef = useRef<ParticleSystemData[]>([]);
  const animationIdRef = useRef<number>();
  const isAnimatingRef = useRef(false);

  const initWebGL = useCallback(async () => {
    try {
      const container = containerRef.current;
      if (!container) return;

      // Create scene setup
      const sceneSetup = await createWebGLScene(container);
      sceneSetupRef.current = sceneSetup;
      const { scene } = sceneSetup;

      // Create 20 curved fiber geometries with particles
      for (let i = 0; i < 20; i++) {
        const curve = await createFiberCurve(i);
        const geometry = await createFiberGeometry(curve, i);
        const material = await createFiberMaterial();

        const { loadThreeJS } = await import('../utils/webglDetection');
        const THREE = await loadThreeJS();
        const fiber = new THREE.Mesh(geometry, material);
        scene.add(fiber);
        fibersRef.current.push(fiber);

        // Create particle system along fiber
        const particleData = await createParticleSystem(curve);
        scene.add(particleData.particles);
        particlesRef.current.push(particleData);
      }

      onLoaded?.();
    } catch (error) {
      console.error('WebGL initialization failed:', error);
      onError?.(error as Error);
    }
  }, [onLoaded, onError]);

  const animate = useCallback(() => {
    if (!sceneSetupRef.current || !isVisible) {
      isAnimatingRef.current = false;
      return;
    }

    isAnimatingRef.current = true;
    const time = Date.now();
    const { scene, camera, renderer } = sceneSetupRef.current;
    
    // Update fiber shaders
    fibersRef.current.forEach((fiber) => {
      if (fiber.material.uniforms) {
        fiber.material.uniforms.time.value = time;
        fiber.material.uniforms.mousePos.value.set(
          mousePosition.x / window.innerWidth,
          1 - mousePosition.y / window.innerHeight
        );
      }
    });

    // Update particle positions along curves
    particlesRef.current.forEach((particleData) => {
      updateParticlePositions(particleData, time);
    });

    renderer.render(scene, camera);
    animationIdRef.current = requestAnimationFrame(animate);
  }, [mousePosition, isVisible]);

  useEffect(() => {
    initWebGL();
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (sceneSetupRef.current?.renderer) {
        sceneSetupRef.current.renderer.dispose();
      }
    };
  }, [initWebGL]);

  useEffect(() => {
    if (sceneSetupRef.current && isVisible && !isAnimatingRef.current) {
      animate();
    } else if (!isVisible && animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      isAnimatingRef.current = false;
    }
  }, [animate, isVisible]);

  useEffect(() => {
    const handleResize = () => {
      if (sceneSetupRef.current) {
        handleSceneResize(sceneSetupRef.current.camera, sceneSetupRef.current.renderer);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full"
      style={{ 
        pointerEvents: 'none',
        contain: 'layout style paint',
        transform: 'translate3d(0,0,0)'
      }}
    />
  );
};

export default WebGLFiberRenderer;
