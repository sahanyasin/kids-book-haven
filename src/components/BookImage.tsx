import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { checkWebPSupport } from "@/utils/imageOptimizer";

interface BookImageProps {
  src: string;
  fallbackUrl?: string;
  alt: string;
  onRemove: (imageUrl: string) => void;
  isAdmin: boolean;
  sizes?: string;
  priority?: boolean;
}

export const BookImage = ({ src, fallbackUrl, alt, onRemove, isAdmin, sizes = "(max-width: 768px) 100vw, 50vw", priority = false }: BookImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>(src);
  const [supportsWebP, setSupportsWebP] = useState<boolean>(true);

  useEffect(() => {
    const checkSupport = async () => {
      const hasWebPSupport = await checkWebPSupport();
      setSupportsWebP(hasWebPSupport);
      if (!hasWebPSupport && fallbackUrl) {
        setImageUrl(fallbackUrl);
      }
    };
    checkSupport();
  }, [fallbackUrl]);

  // Generate srcset for responsive images
  const generateSrcSet = (url: string) => {
    const sizes = [320, 640, 960, 1280];
    return sizes.map(size => `${url}?width=${size} ${size}w`).join(', ');
  };

  return (
    <div className="relative group">
      <img
        src={imageUrl}
        srcSet={generateSrcSet(imageUrl)}
        sizes={sizes}
        alt={alt}
        width={300}
        height={450}
        className="w-full rounded-lg shadow-md"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onError={() => {
          if (fallbackUrl && imageUrl === src) {
            setImageUrl(fallbackUrl);
          }
        }}
      />

      {isAdmin && (
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(src)}
          aria-label="Remove image"
        >
          Remove
        </Button>
      )}
    </div>
  );
};