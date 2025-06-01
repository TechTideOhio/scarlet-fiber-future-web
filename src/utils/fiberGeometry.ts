
import type { CatmullRomCurve3, BufferGeometry, Float32BufferAttribute } from 'three';

export const createFiberCurve = async (index: number) => {
  const { loadThreeJS } = await import('./webglDetection');
  const THREE = await loadThreeJS();
  
  const points = [];
  const startX = (Math.random() - 0.5) * 40;
  const startY = -20;
  const startZ = (Math.random() - 0.5) * 20;

  // Create curve points
  for (let j = 0; j <= 50; j++) {
    const t = j / 50;
    const x = startX + Math.sin(t * Math.PI * 2 + index) * 3;
    const y = startY + t * 40;
    const z = startZ + Math.cos(t * Math.PI * 3 + index) * 2;
    points.push(new THREE.Vector3(x, y, z));
  }

  return new THREE.CatmullRomCurve3(points);
};

export const createFiberGeometry = async (curve: CatmullRomCurve3, fiberIndex: number): Promise<BufferGeometry> => {
  const { loadThreeJS } = await import('./webglDetection');
  const THREE = await loadThreeJS();
  
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
  
  // Add offset attribute for shader
  const offsets = new Float32Array(101);
  for (let j = 0; j < 101; j++) {
    offsets[j] = fiberIndex + j * 0.01;
  }
  geometry.setAttribute('offset', new THREE.Float32BufferAttribute(offsets, 1));

  return geometry;
};
