import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Book } from "@/types/books";

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isAdmin) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('book-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      if (!data) throw new Error('No data returned from upload');

      const { data: { publicUrl } } = supabase.storage
        .from('book-images')
        .getPublicUrl(data.path);

      const newImages = [...book.images, publicUrl];
      
      const { error: updateError } = await supabase
        .from('books')
        .update({ images: newImages })
        .eq('id', book.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
      // Refresh the page to show the new image
      window.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

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
      
      // Refresh the page to show the updated images
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
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`${book.title} - Image ${index + 1}`}
              className="w-full rounded-lg shadow-md"
            />
            {isAdmin && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(image)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>
      {isAdmin && (
        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/90"
          />
        </div>
      )}
    </div>
  );
};