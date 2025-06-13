import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Book } from "@/types/books";
import { BookImage } from "./BookImage";

export function BookCard({ book, priority = false }: { book: Book; priority?: boolean }) {
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return '/placeholder.svg';

    try {
      const url = new URL(imageUrl);
      // Only allow http, https, or data URLs
      if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'data:') {
        return imageUrl;
      }
    } catch (e) {
      // If it's not a valid URL, it might be a relative path, so check if it starts with / or is a placeholder
      if (imageUrl.startsWith('/') || imageUrl === 'placeholder.svg') {
        return imageUrl;
      }
      // If it's a relative path to Unsplash (legacy), convert it.
      if (!imageUrl.startsWith('http')) {
        return `https://images.unsplash.com/${imageUrl}`;
      }
    }
    return '/placeholder.svg'; // Fallback for unsafe or invalid URLs
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
          <BookImage
            src={getImageUrl(book.images?.[0])}
            alt={`Cover of ${book.title}`}
            onRemove={() => {}}
            isAdmin={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
        </CardHeader>
        <CardContent>
          <h3 className="font-bold text-lg mb-2">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.description.substring(0, 100)}...</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {(book.categories || []).filter(Boolean).map((category) => (
              <Badge key={category.id} variant="outline">{category.name}</Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-1">
              {(book.benefits || []).filter(Boolean).map((benefit) => (
                <Badge key={benefit.id} variant="secondary">{benefit.name}</Badge>
              ))}
            </div>
            <span className="font-bold text-primary" aria-label={`Price: $${book.price}`}>
              ${book.price}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}