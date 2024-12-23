import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Book } from "@/types/books";
import { BookImage } from "./BookImage";
import { BookImageUpload } from "./BookImageUpload";

interface BookImageManagerProps {
  book: Book;
}

export const BookImageManager = ({ book }: BookImageManagerProps) => {
  const { toast } = useToast();
  
  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      return !!adminUser;
    }
  });

  const handleRemoveImage = async (imageUrl: string) => {
    if (!isAdmin) return;
    
    try {
      const newImages = book.images.filter(img => img !== imageUrl);
      const { error } = await supabase
        .from('books')
        .update({ images: newImages })
        .eq('id', book.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image removed successfully",
      });
      
      window.location.reload();
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {book.images.map((image, index) => (
          <BookImage
            key={index}
            src={image}
            alt={`${book.title} - Image ${index + 1}`}
            onRemove={handleRemoveImage}
            isAdmin={!!isAdmin}
          />
        ))}
      </div>
      <BookImageUpload book={book} isAdmin={!!isAdmin} />
    </div>
  );
};