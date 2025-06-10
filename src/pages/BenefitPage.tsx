import { useParams } from "react-router-dom";
import { BookCard } from "@/components/BookCard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookSidebar } from "@/components/BookSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/types/books";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

const BenefitPage = () => {
  const { benefit } = useParams();
  
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['books', benefit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select(`
          id,
          title,
          description,
          price,
          benefits:book_benefits!inner(
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
        .eq('benefits.benefit.name', benefit)
        .neq('status', 'Draft');
      
      if (error) throw error;
      
      return data.map(book => ({
        ...book,
        images: book.book_images ? book.book_images.sort((a, b) => a.order_index - b.order_index).map((img: any) => img.url) : [],
        categories: book.categories.map((cat: any) => cat.category),
        benefits: book.benefits ? book.benefits.map((bb: any) => bb.benefit) : [],
      })) as Book[];
    }
  });

  if (error) {
    console.error('Error fetching books:', error);
    return <div className="flex justify-center items-center min-h-screen">Error loading books</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BookSidebar />
        <div className="flex-1 container py-8">
          <h1 className="text-4xl font-bold mb-8">{benefit}</h1>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BenefitPage;