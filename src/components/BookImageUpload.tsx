import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/types/books";
import { useQueryClient } from "@tanstack/react-query";

interface BookImageUploadProps {
  book: Book;
  isAdmin: boolean;
}

export const BookImageUpload = ({ book, isAdmin }: BookImageUploadProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      // Get the current max order_index for this book
      const { data: existingImages, error: fetchError } = await supabase
        .from('book_images')
        .select('order_index')
        .eq('book_id', book.id)
        .order('order_index', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      const newOrderIndex = existingImages && existingImages.length > 0 
        ? existingImages[0].order_index + 1 
        : 0;

      // Insert the new image into the book_images table
      const { error: insertError } = await supabase
        .from('book_images')
        .insert({
          book_id: book.id,
          url: publicUrl,
          order_index: newOrderIndex,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['books'] });
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

  if (!isAdmin) return null;

  return (
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
          file:hover:bg-primary/90"
        aria-label="Upload book image"
      />
    </div>
  );
};