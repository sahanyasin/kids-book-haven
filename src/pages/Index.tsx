import { books, categories } from "@/data/books";
import { BookCard } from "@/components/BookCard";
import { CategoryCard } from "@/components/CategoryCard";

const Index = () => {
  const sponsoredBooks = books.filter(book => book.sponsored);
  const featuredBooks = books.filter(book => !book.sponsored).slice(0, 4);

  return (
    <div className="container py-8">
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

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(category => (
            <CategoryCard 
              key={category} 
              category={category} 
              count={books.filter(b => b.category === category).length}
            />
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
  );
};

export default Index;