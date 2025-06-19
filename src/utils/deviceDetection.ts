
interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  ram: number;
  isOldBrowser: boolean;
  supportsWebGL: boolean;
  prefersCSSOnly: boolean;
  touchEnabled: boolean;
}

export const detectDeviceCapabilities = (): DeviceCapabilities => {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=.*\bTablet\b)/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;
  
  // Estimate RAM based on device memory API or user agent
  let ram = 4; // Default assumption
  if ('deviceMemory' in navigator) {
    ram = (navigator as any).deviceMemory;
  } else if (isMobile) {
    // Estimate based on mobile device patterns
    if (/iPhone|iPad/.test(userAgent)) {
      // iOS devices generally have good RAM
      ram = /iPhone (1[3-9]|[2-9][0-9])/.test(userAgent) ? 6 : 4;
    } else {
      // Android estimation
      ram = 3;
    }
  }

  // Detect old browsers
  const isOldBrowser = (() => {
    const isIE = /MSIE|Trident/i.test(userAgent);
    const isOldChrome = /Chrome\/([0-9]+)/i.test(userAgent) && 
                       parseInt(userAgent.match(/Chrome\/([0-9]+)/i)?.[1] || '0') < 70;
    const isOldFirefox = /Firefox\/([0-9]+)/i.test(userAgent) && 
                        parseInt(userAgent.match(/Firefox\/([0-9]+)/i)?.[1] || '0') < 65;
    const isOldSafari = /Safari\/([0-9]+)/i.test(userAgent) && 
                       parseInt(userAgent.match(/Safari\/([0-9]+)/i)?.[1] || '0') < 605;
    
    return isIE || isOldChrome || isOldFirefox || isOldSafari;
  })();

  // Check WebGL support
  const supportsWebGL = (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  })();

  // More lenient CSS-only determination - only for very old browsers or explicit user preference
  const prefersCSSOnly = isOldBrowser || 
                        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const touchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  console.log('Device capabilities:', {
    isMobile,
    isTablet,
    isDesktop,
    ram,
    isOldBrowser,
    supportsWebGL,
    prefersCSSOnly,
    touchEnabled
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
    ram,
    isOldBrowser,
    supportsWebGL,
    prefersCSSOnly,
    touchEnabled
  };
};

export const getOptimalFiberCount = (capabilities: DeviceCapabilities): number => {
  if (capabilities.prefersCSSOnly) return 0;
  if (capabilities.isMobile) return 8;
  if (capabilities.isTablet) return 12;
  if (capabilities.ram < 4) return 10;
  if (capabilities.ram < 6) return 15;
  return 20;
};

export const shouldUseParticleEffects = (capabilities: DeviceCapabilities): boolean => {
  return !capabilities.isMobile && 
         !capabilities.prefersCSSOnly && 
         capabilities.ram >= 4;
};
