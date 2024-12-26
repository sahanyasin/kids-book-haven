import { useParams } from "react-router-dom";
import { BookCard } from "@/components/BookCard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookSidebar } from "@/components/BookSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/types/books";
import { useEffect } from "react";

const CategoryPage = () => {
  const { category } = useParams();
  
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['books', category],
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
        .eq('book_categories.categories.name', category)
        .neq('status', 'Draft');
      
      if (error) {
        console.error('Error fetching books:', error);
        throw error;
      }

      return data.map(book => ({
        ...book,
        categories: book.categories?.map((cat: any) => cat.category) || []
      })) as Book[];
    }
  });

  useEffect(() => {
    // Update meta tags when category changes
    document.title = `${category} Books - Kids Book Haven`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Explore our collection of ${category} children's books. Find the perfect educational books for your child's development and learning journey.`
      );
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) {
      ogTitle.setAttribute('content', `${category} Books - Kids Book Haven`);
    }
    if (ogDescription) {
      ogDescription.setAttribute('content',
        `Explore our collection of ${category} children's books. Find the perfect educational books for your child.`
      );
    }
  }, [category]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    console.error('Error fetching books:', error);
    return <div className="flex justify-center items-center min-h-screen">Error loading books</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BookSidebar />
        <div className="flex-1 container py-8">
          <h1 className="text-4xl font-bold mb-8">{category}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CategoryPage;