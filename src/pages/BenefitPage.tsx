import { useParams, Link } from "react-router-dom";
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
  console.log('Benefit parameter from URL:', benefit);
  
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['books', benefit],
    queryFn: async () => {
      // Step 1: Get the benefit ID from the benefits table
      const { data: benefitData, error: benefitError } = await supabase
        .from('benefits')
        .select('id')
        .eq('name', benefit)
        .single();

      if (benefitError || !benefitData) {
        console.error('Error fetching benefit ID or benefit not found:', benefitError);
        return []; // Return empty array if benefit not found or error
      }

      const benefitId = benefitData.id;

      // Step 2: Fetch books by filtering through the book_benefits table
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
        .eq('book_benefits.benefit_id', benefitId) // Filter by benefit_id on the junction table
        .neq('status', 'Draft');
      
      if (error) throw error;
      
      const mappedBooks = data.map(book => ({
        ...book,
        images: book.book_images ? book.book_images.sort((a, b) => a.order_index - b.order_index).map((img: any) => img.url) : [],
        categories: book.categories.map((cat: any) => cat.category),
        benefits: book.benefits ? book.benefits.map((bb: any) => bb.benefit).filter(Boolean) : [],
      }));

      console.log('Fetched and mapped books with benefits:', mappedBooks);

      return mappedBooks as Book[];
    }
  });

  if (error) {
    console.error('Error fetching books:', error);
    return <div className="flex justify-center items-center min-h-screen">Error loading books</div>;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BookSidebar />
        <div className="flex-1 container py-8">
          <Link to="/" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Directory
          </Link>
          
          <h1 className="text-3xl font-bold mb-8 capitalize">
            {benefit} Books
          </h1>
          
          {books.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No books found for this benefit.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
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