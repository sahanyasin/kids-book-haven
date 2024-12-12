import { books } from "@/data/books";
import { BookCard } from "@/components/BookCard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookSidebar } from "@/components/BookSidebar";

const Index = () => {
  const sponsoredBooks = books.filter(book => book.sponsored);
  const featuredBooks = books.filter(book => !book.sponsored).slice(0, 4);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BookSidebar />
        <div className="flex-1 container py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Children's Book Directory</h1>
          
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