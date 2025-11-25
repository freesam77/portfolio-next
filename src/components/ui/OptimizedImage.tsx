'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackIcon?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  fallbackIcon = '🔧'
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If we have an error and it's an external svgrepo URL, show fallback
  if (hasError && imageSrc.includes('svgrepo.com')) {
    return (
      <div 
        className={`${className} flex items-center justify-center text-2xl`}
        style={{ width, height }}
        title={`Icon for ${alt} (temporarily unavailable)`}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div 
          className={`${className} flex items-center justify-center bg-gray-200 animate-pulse`}
          style={{ width, height }}
        >
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
        priority={false}
        loading="lazy"
      />
    </>
  );
};

export default OptimizedImage;