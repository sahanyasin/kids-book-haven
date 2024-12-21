import { useParams, Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookSidebar } from "@/components/BookSidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookImageManager } from "@/components/BookImageManager";
import { BookDetails } from "@/components/BookDetails";
import type { Book } from "@/types/books";

const BookDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

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
            <BookImageManager book={book} />
            <BookDetails book={book} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BookDetail;