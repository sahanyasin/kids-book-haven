import { useParams } from "react-router-dom";
import { books } from "@/data/books";
import { BookCard } from "@/components/BookCard";

const CategoryPage = () => {
  const { category } = useParams();
  const categoryBooks = books.filter(book => book.category === category);

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">{category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryBooks.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;