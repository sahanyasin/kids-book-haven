import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/types/books";

interface BookImageUploadProps {
  book: Book;
  isAdmin: boolean;
}

export const BookImageUpload = ({ book, isAdmin }: BookImageUploadProps) => {
  const { toast } = useToast();

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