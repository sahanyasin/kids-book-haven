import { useState } from "react";
import { BookCard } from "@/components/BookCard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookSidebar } from "@/components/BookSidebar";
import { SearchInput } from "@/components/SearchInput";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/types/books";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*');
      
      if (error) throw error;
      return data as Book[];
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    console.error('Error fetching books:', error);
    return <div className="flex justify-center items-center min-h-screen">Error loading books</div>;
  }

  const filteredBooks = books.filter(book => {
    const searchLower = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.description.toLowerCase().includes(searchLower) ||
      book.category.toLowerCase().includes(searchLower) ||
      book.benefit.toLowerCase().includes(searchLower)
    );
  });

  const sponsoredBooks = filteredBooks.filter(book => book.sponsored);
  const featuredBooks = filteredBooks.filter(book => !book.sponsored).slice(0, 4);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BookSidebar />
        <div className="flex-1 container py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Children's Book Directory</h1>
          
          {/* Search Section */}
          <div className="mb-8 max-w-xl mx-auto">
            <SearchInput 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by title, category, or benefit..."
            />
          </div>
          
          {/* Sponsored Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Featured Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsoredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          {/* Featured Books Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Popular Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;