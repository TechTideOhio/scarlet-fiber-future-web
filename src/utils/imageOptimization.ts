/**
 * Image optimization utilities for lazy loading, WebP detection, and URL optimization
 */

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=600&q=80";

/**
 * Check if the browser supports WebP format
 */
export const supportsWebP = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Get optimized image URL with format and quality parameters
 */
export const getOptimizedImageUrl = (
  url: string | null,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string => {
  if (!url) return FALLBACK_IMAGE;
  
  const { width, height, quality = 80, format = 'auto' } = options;
  
  // Handle Unsplash URLs
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    let optimizedUrl = `${url}${separator}auto=format&q=${quality}`;
    
    if (width) optimizedUrl += `&w=${width}`;
    if (height) optimizedUrl += `&h=${height}`;
    if (format !== 'auto') optimizedUrl += `&fm=${format}`;
    
    return optimizedUrl;
  }
  
  // Handle Supabase Storage URLs
  if (url.includes('supabase.co/storage')) {
    // Supabase transforms are done via query params
    const urlObj = new URL(url);
    if (width) urlObj.searchParams.set('width', width.toString());
    if (height) urlObj.searchParams.set('height', height.toString());
    if (quality) urlObj.searchParams.set('quality', quality.toString());
    return urlObj.toString();
  }
  
  // Handle lovable-uploads
  if (url.startsWith('/lovable-uploads/')) {
    return url;
  }
  
  // Handle full URLs
  if (url.startsWith('http')) {
    return url;
  }
  
  // Assume it's an Unsplash photo ID
  return `https://images.unsplash.com/${url}?auto=format&fit=crop&w=${width || 600}&q=${quality}`;
};

/**
 * Generate srcSet for responsive images
 */
export const generateSrcSet = (
  url: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string => {
  if (!url || !url.includes('unsplash.com')) return '';
  
  return sizes
    .map((size) => `${getOptimizedImageUrl(url, { width: size })} ${size}w`)
    .join(', ');
};

/**
 * Get appropriate sizes attribute for responsive images
 */
export const getImageSizes = (type: 'thumbnail' | 'card' | 'hero' | 'full'): string => {
  switch (type) {
    case 'thumbnail':
      return '(max-width: 640px) 100vw, 150px';
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'hero':
      return '100vw';
    case 'full':
      return '100vw';
    default:
      return '100vw';
  }
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
};
