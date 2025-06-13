import { useParams, Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookSidebar } from "@/components/BookSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookImageManager } from "@/components/BookImageManager";
import { BookDetails } from "@/components/BookDetails";
import type { Book } from "@/types/books";
import { useEffect } from "react";

const BookDetail = () => {
  const { id } = useParams();

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select(`
          id,
          title,
          description,
          price,
          benefits:book_benefits(
            benefit:benefits(
              id,
              name
            )
          ),
          sponsored,
          images,
          author,
          book_link,
          created_at,
          updated_at,
          status,
          categories:book_categories(
            category:categories(
              id,
              name
            )
          ),
          book_images(url, order_index)
        `)
        .eq('id', id)
        .neq('status', 'Draft')
        .single();
      
      if (error) throw error;
      
      // book_images'ı sıralayarak Book tipine uygun hale getir
      const sortedImages = data.book_images.sort((a, b) => a.order_index - b.order_index).map((img: { url: string }) => img.url);

      return {
        ...data,
        images: sortedImages,
        categories: data.categories.map((cat: any) => cat.category),
        benefits: data.benefits ? data.benefits.map((bb: any) => bb.benefit).filter(Boolean) : [],
      } as Book;
    }
  });

  useEffect(() => {
    if (book) {
      // Update page title
      document.title = `${book.title} by ${book.author} - Kids Book Haven`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `${book.description.substring(0, 150)}... A book focusing on ${book.benefits?.[0]?.name}.`
        );
      }

      // Update OpenGraph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      
      if (ogTitle) {
        ogTitle.setAttribute('content', `${book.title} by ${book.author} - Kids Book Haven`);
      }
      if (ogDescription) {
        ogDescription.setAttribute('content', book.description.substring(0, 150));
      }
      if (ogImage && book.images?.[0]) {
        ogImage.setAttribute('content', book.images[0]);
      }
    }
  }, [book]);

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