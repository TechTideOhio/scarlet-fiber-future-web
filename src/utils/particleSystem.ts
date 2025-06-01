
import type { CatmullRomCurve3, Points, BufferGeometry, PointsMaterial } from 'three';

export interface ParticleSystemData {
  particles: Points;
  curve: CatmullRomCurve3;
  offset: number;
}

export const createParticleSystem = async (curve: CatmullRomCurve3): Promise<ParticleSystemData> => {
  const { loadThreeJS } = await import('./webglDetection');
  const THREE = await loadThreeJS();
  
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
  const offset = Math.random() * Math.PI * 2;

  return { particles, curve, offset };
};

export const updateParticlePositions = (particleData: ParticleSystemData, time: number) => {
  const { particles, curve, offset } = particleData;
  const positions = particles.geometry.attributes.position.array as Float32Array;
  const particleCount = positions.length / 3;
  
  for (let i = 0; i < particleCount; i++) {
    const t = ((time * 0.0005 + offset + i * 0.1) % 1);
    const point = curve.getPoint(t);
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = point.z;
  }
  
  particles.geometry.attributes.position.needsUpdate = true;
};
