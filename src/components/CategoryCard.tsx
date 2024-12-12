import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function CategoryCard({ category, count }: { category: string; count: number }) {
  return (
    <Link to={`/category/${category}`}>
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <h3 className="font-bold text-xl mb-2">{category}</h3>
          <p className="text-sm text-gray-600">{count} books</p>
        </CardContent>
      </Card>
    </Link>
  );
}