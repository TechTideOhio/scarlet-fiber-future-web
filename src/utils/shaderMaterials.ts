
export const getFiberShaders = () => {
  const vertexShader = `
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

  const fragmentShader = `
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

  return { vertexShader, fragmentShader };
};

export const createFiberMaterial = async () => {
  const { loadThreeJS } = await import('./webglDetection');
  const THREE = await loadThreeJS();
  const { vertexShader, fragmentShader } = getFiberShaders();

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 },
      mousePos: { value: new THREE.Vector2(0.5, 0.5) }
    },
    transparent: true,
    blending: THREE.AdditiveBlending
  });
};
