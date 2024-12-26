import { useState, Suspense } from "react";
import { BookCard } from "@/components/BookCard";
import { CategoryCard } from "@/components/CategoryCard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookSidebar } from "@/components/BookSidebar";
import { SearchInput } from "@/components/SearchInput";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/types/books";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-background rounded-lg p-4 space-y-4">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    ))}
  </div>
);

const BookSection = ({ title, books }: { title: string; books: Book[] }) => (
  <section className="mb-12">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  </section>
);

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: books = [], isLoading: booksLoading, error: booksError } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select(`
          id,
          title,
          description,
          price,
          benefit,
          sponsored,
          images,
          author,
          book_link,
          created_at,
          updated_at,
          categories:book_categories(
            category:categories(
              id,
              name
            )
          )
        `)
        .neq('status', 'Draft')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching books:', error);
        throw error;
      }
      
      return data.map(book => ({
        ...book,
        categories: book.categories.map((cat: any) => cat.category)
      })) as Book[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: featuredCategories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['featured-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_categories')
        .select('*')
        .order('display_order');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const filteredBooks = books.filter(book => {
    const searchLower = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.description.toLowerCase().includes(searchLower) ||
      book.categories.some(cat => cat.name.toLowerCase().includes(searchLower)) ||
      book.benefit.toLowerCase().includes(searchLower)
    );
  });

  const sponsoredBooks = filteredBooks.filter(book => book.sponsored);
  const featuredBooks = filteredBooks.filter(book => !book.sponsored).slice(0, 4);

  const getCategoryBookCount = (category: string) => {
    return books.filter(book => 
      book.categories.some(cat => cat.name === category)
    ).length;
  };

  if (booksError) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-destructive">Error loading books. Please try again later.</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <BookSidebar />
          <div className="flex-1 container py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Children's Book Directory</h1>
            
            <div className="mb-8 max-w-xl mx-auto">
              <SearchInput 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by title, category, or benefit..."
              />
            </div>

            <Suspense fallback={<LoadingSkeleton />}>
              {categoriesLoading ? (
                <LoadingSkeleton />
              ) : featuredCategories.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">Featured Categories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredCategories.map(category => (
                      <CategoryCard 
                        key={category.id}
                        category={category.category}
                        count={getCategoryBookCount(category.category)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {booksLoading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  {sponsoredBooks.length > 0 && (
                    <BookSection title="Featured Books" books={sponsoredBooks} />
                  )}
                  {featuredBooks.length > 0 && (
                    <BookSection title="Popular Books" books={featuredBooks} />
                  )}
                </>
              )}
            </Suspense>
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default Index;