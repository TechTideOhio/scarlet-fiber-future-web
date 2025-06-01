
interface PerformanceScore {
  webglSupported: boolean;
  score: number;
  shouldUseWebGL: boolean;
}

export const detectWebGLCapabilities = (): PerformanceScore => {
  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) {
    return { webglSupported: false, score: 0, shouldUseWebGL: false };
  }

  let score = 0;
  
  // Test WebGL features and performance
  try {
    // Check max texture size (indicates GPU power)
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTextureSize >= 4096) score += 30;
    else if (maxTextureSize >= 2048) score += 20;
    else score += 10;

    // Check max varying vectors (shader complexity support)
    const maxVaryingVectors = gl.getParameter(gl.MAX_VARYING_VECTORS);
    if (maxVaryingVectors >= 16) score += 20;
    else if (maxVaryingVectors >= 8) score += 10;

    // Check renderer (avoid software rendering)
    const renderer = gl.getParameter(gl.RENDERER);
    if (renderer && !renderer.toLowerCase().includes('software')) {
      score += 20;
    }

    // Simple performance benchmark
    const start = performance.now();
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(1000), gl.STATIC_DRAW);
    const end = performance.now();
    
    if (end - start < 1) score += 20;
    else if (end - start < 5) score += 10;

    // Check memory info if available
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      if (vendor && (vendor.includes('NVIDIA') || vendor.includes('AMD') || vendor.includes('Intel'))) {
        score += 10;
      }
    }

  } catch (error) {
    console.warn('WebGL capability test failed:', error);
    score = 0;
  }

  // Cleanup
  canvas.remove();

  return {
    webglSupported: true,
    score,
    shouldUseWebGL: score >= 70 // Require high score for WebGL
  };
};

export const loadThreeJS = async () => {
  try {
    const [
      { Scene, PerspectiveCamera, WebGLRenderer },
      { Mesh, BufferGeometry, Float32BufferAttribute },
      { ShaderMaterial, AdditiveBlending },
      { CatmullRomCurve3, Vector3 },
      { Points, PointsMaterial }
    ] = await Promise.all([
      import('three'),
      import('three'),
      import('three'),
      import('three'),
      import('three')
    ]);

    return {
      Scene,
      PerspectiveCamera,
      WebGLRenderer,
      Mesh,
      BufferGeometry,
      Float32BufferAttribute,
      ShaderMaterial,
      AdditiveBlending,
      CatmullRomCurve3,
      Vector3,
      Points,
      PointsMaterial
    };
  } catch (error) {
    console.error('Failed to load Three.js:', error);
    throw error;
  }
};
