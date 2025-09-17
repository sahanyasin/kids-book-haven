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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

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

const BookSection = ({ title, books, isFirstSection = false }: { title: string; books: Book[]; isFirstSection?: boolean }) => (
  <section className="mb-12">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book, index) => (
        <BookCard key={book.id} book={book} priority={isFirstSection && index < 4} />
      ))}
    </div>
  </section>
);

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const booksPerPage = 8;

  const { data: booksData = {}, isLoading: booksLoading, error: booksError } = useQuery({
    queryKey: ['books', currentPage, searchQuery],
    queryFn: async () => {
      const from = currentPage * booksPerPage;
      const to = from + booksPerPage - 1;

      let query = supabase
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
        `, { count: 'exact' })
        .neq('status', 'Draft')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        query = query.or(`title.ilike.%${searchLower}%,description.ilike.%${searchLower}%`);
      }

      const { data, error, count } = await query.range(from, to);
      
      if (error) {
        console.error('Error fetching books:', error);
        throw error;
      }
      
      return {
        books: data.map(book => ({
          ...book,
          images: book.book_images ? book.book_images.sort((a, b) => a.order_index - b.order_index).map((img: any) => img.url) : [],
          categories: book.categories.map((cat: any) => cat.category),
          benefits: book.benefits ? book.benefits.map((bb: any) => bb.benefit).filter(Boolean) : [],
        })) as Book[],
        count: count || 0,
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  const { books = [], count: totalBooks = 0 } = booksData as { books: Book[], count: number };
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  const { data: featuredCategories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['featured-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_categories')
        .select(`
          id,
          display_order,
          category_id,
          categories:categories(
            id,
            name,
            book_categories(count)
          )
        `)
        .eq('is_visible', true)
        .order('display_order');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      return data.map(fc => ({
        ...fc,
        category: fc.categories.name,
        book_count: fc.categories.book_categories[0]?.count || 0
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const sponsoredBooks = books.filter(book => book.sponsored);
  const nonSponsoredBooks = books.filter(book => !book.sponsored);

  const queryClient = useQueryClient();

  if (booksError) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] p-4">
        <Alert variant="destructive" className="max-w-md">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error Loading Books</AlertTitle>
          <AlertDescription>
            <p>There was an error loading the books: {booksError.message}</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['books'] })} className="mt-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (categoriesLoading) {
    return <LoadingSkeleton />;
  }

  if (featuredCategories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] p-4">
        <Alert>
          <AlertTitle>No Categories Found</AlertTitle>
          <AlertDescription>
            There are no featured categories to display at the moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const displayBooks = searchQuery ? books : nonSponsoredBooks;
  const displayTitle = searchQuery ? "Search Results" : "Popular Books";

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <BookSidebar />
          <div className="flex-1 container py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Bİr Kitap Bir Minik Okur...</h1>
                    
            <div className="mb-12 max-w-xl mx-auto">
              <SearchInput
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e);
                  setCurrentPage(0);
                }}
                placeholder="Search by title..."
              />
            </div>

            <Suspense fallback={<LoadingSkeleton />}>
              {featuredCategories.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">Featured Categories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredCategories.map(category => (
                      <CategoryCard
                        key={category.id}
                        category={category.category}
                        count={category.book_count}
                      />
                    ))}
                  </div>
                </section>
              )}

              {booksLoading ? (
                <LoadingSkeleton />
              ) : displayBooks.length > 0 ? (
                <>
                  {sponsoredBooks.length > 0 && !searchQuery && (
                    <BookSection title="Sponsored Books" books={sponsoredBooks.slice(0, 4)} />
                  )}
                  <BookSection title={displayTitle} books={displayBooks} />
                </>
              ) : (
                <div className="flex justify-center items-center min-h-[30vh] p-4">
                  <Alert>
                    <AlertTitle>No Books Found</AlertTitle>
                    <AlertDescription>
                      {searchQuery 
                        ? `No books found for "${searchQuery}". Please try a different search term.`
                        : "No books are available at the moment. Please check back later."
                      }
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-lg font-medium">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default Index;