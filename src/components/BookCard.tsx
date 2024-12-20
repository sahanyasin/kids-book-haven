import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Book } from "@/types/books";

export function BookCard({ book }: { book: Book }) {
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return '/placeholder.svg';
    
    // Handle both Supabase Storage and Unsplash URLs
    return imageUrl.startsWith('http') 
      ? imageUrl 
      : `https://images.unsplash.com/${imageUrl}`;
  };

  return (
    <Link to={`/book/${book.id}`}>
      <Card className={`h-full transition-all duration-300 hover:shadow-lg ${book.sponsored ? 'border-sponsored border-2' : ''}`}>
        <CardHeader className="relative">
          {book.sponsored && (
            <Badge className="absolute top-4 right-4 bg-sponsored">
              Sponsored
            </Badge>
          )}
          <img
            src={getImageUrl(book.images?.[0])}
            alt={book.title}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/placeholder.svg';
            }}
          />
        </CardHeader>
        <CardContent>
          <h3 className="font-bold text-lg mb-2">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.description.substring(0, 100)}...</p>
          <div className="flex justify-between items-center">
            <Badge variant="secondary">{book.benefit}</Badge>
            <span className="font-bold text-primary">${book.price}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}