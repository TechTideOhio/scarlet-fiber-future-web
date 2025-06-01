
import type { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

export interface SceneSetup {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
}

export const createWebGLScene = async (container: HTMLDivElement): Promise<SceneSetup> => {
  const { loadThreeJS } = await import('./webglDetection');
  const THREE = await loadThreeJS();

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

  camera.position.z = 30;

  return { scene, camera, renderer };
};

export const handleSceneResize = (camera: PerspectiveCamera, renderer: WebGLRenderer) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
