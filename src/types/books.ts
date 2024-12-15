export type Book = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  benefit: 'Emotional Intelligence' | 'Problem Solving' | 'Social Skills' | 'Character Building' | 'Language Development';
  sponsored: boolean | null;
  images: string[];
  created_at: string | null;
  updated_at: string | null;
  author: string;
  book_link: string | null;
}