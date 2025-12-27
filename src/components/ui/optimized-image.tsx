import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  aspectRatio?: string;
  priority?: boolean;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=600&q=80";

/**
 * OptimizedImage component with lazy loading, error handling, and blur placeholder
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  fallbackSrc = FALLBACK_IMAGE,
  aspectRatio,
  priority = false,
  className,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Build optimized URL for Unsplash images
  const getOptimizedSrc = (url: string): string => {
    if (!url) return fallbackSrc;
    
    // Add WebP format and quality params for Unsplash
    if (url.includes('unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      let optimizedUrl = `${url}${separator}auto=format&q=80`;
      if (width) {
        optimizedUrl += `&w=${width}`;
      }
      return optimizedUrl;
    }
    
    return url;
  };

  const imageSrc = hasError ? fallbackSrc : getOptimizedSrc(src);

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        aspectRatio && `aspect-[${aspectRatio}]`,
        className
      )}
      style={{
        aspectRatio: aspectRatio,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {/* Blur placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted-foreground/20" />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      )}
    </div>
  );
};

export { OptimizedImage };
export default OptimizedImage;
