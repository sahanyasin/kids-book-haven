import { useParams, Link } from "react-router-dom";
import { books } from "@/data/books";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BookDetail = () => {
  const { id } = useParams();
  const book = books.find(b => b.id === Number(id));

  if (!book) {
    return <div className="container py-8">Book not found</div>;
  }

  return (
    <div className="container py-8">
      <Link to="/" className="text-primary hover:underline mb-4 inline-block">
        ← Back to Directory
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="grid grid-cols-2 gap-4">
            {book.images.map((image, index) => (
              <img
                key={index}
                src={`https://source.unsplash.com/${image}`}
                alt={`${book.title} - Image ${index + 1}`}
                className="w-full rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold">{book.title}</h1>
            {book.sponsored && (
              <Badge className="bg-sponsored">Sponsored</Badge>
            )}
          </div>
          
          <div className="flex gap-2 mb-4">
            <Badge variant="outline">{book.category}</Badge>
            <Badge variant="secondary">{book.benefit}</Badge>
          </div>
          
          <p className="text-lg mb-6">{book.description}</p>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">${book.price}</span>
                <Button size="lg">Add to Cart</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;