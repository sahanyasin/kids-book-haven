import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Book } from "@/types/books";

interface BookDetailsProps {
  book: Book;
}

export const BookDetails = ({ book }: BookDetailsProps) => {
  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold">{book.title}</h1>
          <p className="text-gray-600 mt-2">By {book.author}</p>
        </div>
        {book.sponsored && (
          <Badge className="bg-sponsored">Sponsored</Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {book.categories.map((category) => (
          <Badge key={category.id} variant="outline">{category.name}</Badge>
        ))}
        <Badge variant="secondary">{book.benefit}</Badge>
      </div>
      
      <p className="text-lg mb-6">{book.description}</p>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">${book.price}</span>
            {book.book_link && (
              <Button
                variant="default"
                onClick={() => window.open(book.book_link, '_blank', 'noopener,noreferrer')}
              >
                Buy on Amazon
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};