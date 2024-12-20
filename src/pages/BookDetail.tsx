import { useParams, Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookSidebar } from "@/components/BookSidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Book } from "@/types/books";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .neq('status', 'Draft')
        .single();
      
      if (error) throw error;
      return data as Book;
    }
  });

  const updateBookMutation = useMutation({
    mutationFn: async (newImages: string[]) => {
      const { error } = await supabase
        .from('books')
        .update({ images: newImages })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Book images updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update book images",
        variant: "destructive",
      });
      console.error('Error updating book:', error);
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

      const newImages = [...(book?.images || []), publicUrl];
      await updateBookMutation.mutateAsync(newImages);
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
    if (!book || !isAdmin) return;
    
    try {
      const newImages = book.images.filter(img => img !== imageUrl);
      await updateBookMutation.mutateAsync(newImages);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  if (isLoading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (error || !book) {
    return <div className="container py-8">Book not found</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BookSidebar />
        <div className="flex-1 container py-8">
          <Link to="/" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Directory
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold">{book.title}</h1>
                  <p className="text-gray-600 mt-2">By {book.author}</p>
                </div>
                {book.sponsored && (
                  <Badge className="bg-sponsored">Sponsored</Badge>
                )}
              </div>
              
              <div className="flex gap-2 mb-4">
                <Badge variant="outline">{book.category}</Badge>
                <Badge variant="secondary">{book.benefit}</Badge>
              </div>
              
              <p className="text-lg mb-6">{book.description}</p>
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${book.price}</span>
                    {book.book_link && (
                      <Button
                        variant="default"
                        onClick={() => window.open(book.book_link, '_blank', 'noopener,noreferrer')}
                      >
                        Buy on Amazon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BookDetail;