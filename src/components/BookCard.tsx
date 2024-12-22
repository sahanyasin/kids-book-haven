import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Book } from "@/types/books";

export function BookCard({ book }: { book: Book }) {
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return '/placeholder.svg';
    
    return imageUrl.startsWith('http') 
      ? imageUrl 
      : `https://images.unsplash.com/${imageUrl}`;
  };

  return (
    <Link 
      to={`/book/${book.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      aria-label={`View details for ${book.title}`}
    >
      <Card className={`h-full transition-all duration-300 hover:shadow-lg ${book.sponsored ? 'border-sponsored border-2' : ''}`}>
        <CardHeader className="relative">
          {book.sponsored && (
            <Badge className="absolute top-4 right-4 bg-sponsored" aria-label="Sponsored content">
              Sponsored
            </Badge>
          )}
          <img
            src={getImageUrl(book.images?.[0])}
            alt={`Cover of ${book.title}`}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/placeholder.svg';
              img.alt = 'Book cover placeholder';
            }}
          />
        </CardHeader>
        <CardContent>
          <h3 className="font-bold text-lg mb-2">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.description.substring(0, 100)}...</p>
          <div className="flex justify-between items-center">
            <Badge variant="secondary">{book.benefit}</Badge>
            <span className="font-bold text-primary" aria-label={`Price: $${book.price}`}>
              ${book.price}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}