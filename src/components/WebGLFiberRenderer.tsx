
import React, { useEffect, useRef, useCallback } from 'react';
import { loadThreeJS } from '../utils/webglDetection';

interface WebGLFiberRendererProps {
  onLoaded?: () => void;
  onError?: (error: Error) => void;
  mousePosition: { x: number; y: number };
}

const WebGLFiberRenderer: React.FC<WebGLFiberRendererProps> = ({
  onLoaded,
  onError,
  mousePosition
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const fibersRef = useRef<any[]>([]);
  const particlesRef = useRef<any[]>([]);
  const animationIdRef = useRef<number>();

  const initWebGL = useCallback(async () => {
    try {
      const THREE = await loadThreeJS();
      const container = containerRef.current;
      if (!container) return;

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: 'high-performance'
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      sceneRef.current = scene;
      rendererRef.current = renderer;

      // Custom fiber shader
      const fiberVertexShader = `
        uniform float time;
        uniform vec2 mousePos;
        attribute float offset;
        varying float vOffset;
        varying vec3 vPosition;
        
        void main() {
          vOffset = offset;
          vPosition = position;
          
          vec3 pos = position;
          
          // Wave motion
          pos.x += sin(time * 0.002 + offset * 0.1) * 2.0;
          pos.y += cos(time * 0.001 + offset * 0.15) * 1.5;
          
          // Mouse influence
          vec2 mouseInfluence = (mousePos - vec2(0.5)) * 20.0;
          pos.x += mouseInfluence.x * 0.1;
          pos.y += mouseInfluence.y * 0.1;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `;

      const fiberFragmentShader = `
        uniform float time;
        uniform vec2 mousePos;
        varying float vOffset;
        varying vec3 vPosition;
        
        void main() {
          float glow = 1.0 - abs(vPosition.x / 2.0);
          glow = pow(glow, 2.0);
          
          // Mouse proximity glow
          vec2 screenPos = gl_FragCoord.xy / vec2(1920.0, 1080.0);
          float mouseDist = distance(screenPos, mousePos);
          float mouseGlow = 1.0 - smoothstep(0.0, 0.3, mouseDist);
          
          glow += mouseGlow * 0.5;
          
          vec3 color = vec3(0.73, 0.0, 0.0) * glow;
          gl_FragColor = vec4(color, glow * 0.8);
        }
      `;

      // Create 20 curved fiber geometries
      for (let i = 0; i < 20; i++) {
        const points = [];
        const startX = (Math.random() - 0.5) * 40;
        const startY = -20;
        const startZ = (Math.random() - 0.5) * 20;

        // Create curve points
        for (let j = 0; j <= 50; j++) {
          const t = j / 50;
          const x = startX + Math.sin(t * Math.PI * 2 + i) * 3;
          const y = startY + t * 40;
          const z = startZ + Math.cos(t * Math.PI * 3 + i) * 2;
          points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
        
        // Add offset attribute for shader
        const offsets = new Float32Array(101);
        for (let j = 0; j < 101; j++) {
          offsets[j] = i + j * 0.01;
        }
        geometry.setAttribute('offset', new THREE.Float32BufferAttribute(offsets, 1));

        const material = new THREE.ShaderMaterial({
          vertexShader: fiberVertexShader,
          fragmentShader: fiberFragmentShader,
          uniforms: {
            time: { value: 0 },
            mousePos: { value: new THREE.Vector2(0.5, 0.5) }
          },
          transparent: true,
          blending: THREE.AdditiveBlending
        });

        const fiber = new THREE.Mesh(geometry, material);
        scene.add(fiber);
        fibersRef.current.push(fiber);

        // Create particle system along fiber
        const particleCount = 20;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let j = 0; j < particleCount; j++) {
          const t = j / particleCount;
          const point = curve.getPoint(t);
          positions[j * 3] = point.x;
          positions[j * 3 + 1] = point.y;
          positions[j * 3 + 2] = point.z;
        }
        
        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
          color: 0xbb0000,
          size: 0.5,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        particlesRef.current.push({ particles, curve, offset: Math.random() * Math.PI * 2 });
      }

      camera.position.z = 30;

      onLoaded?.();
    } catch (error) {
      console.error('WebGL initialization failed:', error);
      onError?.(error as Error);
    }
  }, [onLoaded, onError]);

  const animate = useCallback(() => {
    if (!sceneRef.current || !rendererRef.current) return;

    const time = Date.now();
    
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
    particlesRef.current.forEach(({ particles, curve, offset }, index) => {
      const positions = particles.geometry.attributes.position.array;
      const particleCount = positions.length / 3;
      
      for (let i = 0; i < particleCount; i++) {
        const t = ((time * 0.0005 + offset + i * 0.1) % 1);
        const point = curve.getPoint(t);
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
    });

    rendererRef.current.render(sceneRef.current, sceneRef.current.children.find((child: any) => child.isCamera) || sceneRef.current.children[0]);
    animationIdRef.current = requestAnimationFrame(animate);
  }, [mousePosition]);

  useEffect(() => {
    initWebGL();
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initWebGL]);

  useEffect(() => {
    if (sceneRef.current) {
      animate();
    }
  }, [animate]);

  useEffect(() => {
    const handleResize = () => {
      if (rendererRef.current && sceneRef.current) {
        const camera = sceneRef.current.children.find((child: any) => child.isCamera);
        if (camera) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
        }
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default WebGLFiberRenderer;
