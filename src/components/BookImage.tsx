import { Button } from "@/components/ui/button";

interface BookImageProps {
  src: string;
  alt: string;
  onRemove: (imageUrl: string) => void;
  isAdmin: boolean;
}

export const BookImage = ({ src, alt, onRemove, isAdmin }: BookImageProps) => {
  return (
    <div className="relative group">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg shadow-md"
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