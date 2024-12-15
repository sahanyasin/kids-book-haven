import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookSidebar } from "@/components/BookSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/types/books";

const BookDetail = () => {
  const { id } = useParams();

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Book;
    }
  });

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
              <div className="grid grid-cols-2 gap-4">
                {book.images.map((image, index) => (
                  <img
                    key={index}
                    src={`https://images.unsplash.com/${image}`}
                    alt={`${book.title} - Image ${index + 1}`}
                    className="w-full rounded-lg shadow-md"
                  />
                ))}
              </div>
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
                      <a 
                        href={book.book_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View on Amazon
                      </a>
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
}

export default BookDetail;