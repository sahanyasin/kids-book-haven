export type Book = {
  id: string;
  title: string;
  description: string;
  price: number;
  categories: { id: string; name: string }[];
  benefits: { id: string; name: string | null }[];
  sponsored: boolean | null;
  images: string[];
  created_at: string | null;
  updated_at: string | null;
  author: string;
  book_link: string | null;
  status: 'Draft' | 'Published' | 'Rejected';
}