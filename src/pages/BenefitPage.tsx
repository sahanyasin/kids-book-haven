import { useParams } from "react-router-dom";
import { books } from "@/data/books";
import { BookCard } from "@/components/BookCard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookSidebar } from "@/components/BookSidebar";

const BenefitPage = () => {
  const { benefit } = useParams();
  const filteredBooks = books.filter(book => book.benefit === benefit);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BookSidebar />
        <div className="flex-1 container py-8">
          <h1 className="text-4xl font-bold mb-8">{benefit}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BenefitPage;