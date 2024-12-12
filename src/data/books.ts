export interface Book {
  id: number;
  title: string;
  description: string;
  category: string;
  benefit: string;
  price: number;
  images: string[];
  sponsored?: boolean;
}

export const books: Book[] = [
  {
    id: 1,
    title: "The Emotional Rainbow",
    description: "Join Sarah as she discovers different emotions through colors. Perfect for teaching emotional awareness and vocabulary.",
    category: "Picture Books",
    benefit: "Emotional Intelligence",
    price: 14.99,
    images: ["photo-1649972904349-6e44c42644a7", "photo-1488590528505-98d2b5aba04b"],
    sponsored: true
  },
  {
    id: 2,
    title: "Little Scientists: The Garden Adventure",
    description: "Explore basic scientific concepts through an exciting garden adventure.",
    category: "Educational",
    benefit: "Problem Solving",
    price: 12.99,
    images: ["photo-1518770660439-4636190af475"]
  },
  {
    id: 3,
    title: "Friends of the Forest",
    description: "A heartwarming tale about friendship and cooperation among forest animals.",
    category: "Picture Books",
    benefit: "Social Skills",
    price: 11.99,
    images: ["photo-1461749280684-dccba630e2f6"]
  },
  {
    id: 4,
    title: "The Number Quest",
    description: "Make learning math fun with this interactive adventure story.",
    category: "Educational",
    benefit: "Problem Solving",
    price: 13.99,
    images: ["photo-1486312338219-ce68d2c6f44d"]
  },
  {
    id: 5,
    title: "Bedtime for Baby Bear",
    description: "A soothing bedtime story perfect for establishing nighttime routines.",
    category: "Bedtime Stories",
    benefit: "Emotional Intelligence",
    price: 10.99,
    images: ["photo-1581091226825-a6a2a5aee158"],
    sponsored: true
  },
  {
    id: 6,
    title: "The Brave Little Robot",
    description: "Learn about courage and perseverance with this adorable robot character.",
    category: "Picture Books",
    benefit: "Character Building",
    price: 15.99,
    images: ["photo-1485827404703-89b55fcc595e"]
  },
  {
    id: 7,
    title: "Words Are Magic",
    description: "A fun introduction to reading and the power of vocabulary.",
    category: "Educational",
    benefit: "Language Development",
    price: 12.99,
    images: ["photo-1498050108023-c5249f4df085"]
  },
  {
    id: 8,
    title: "The Kind Kangaroo",
    description: "Teaching kindness and empathy through entertaining stories.",
    category: "Picture Books",
    benefit: "Character Building",
    price: 11.99,
    images: ["photo-1649972904349-6e44c42644a7"]
  },
  {
    id: 9,
    title: "Count the Stars",
    description: "A beautiful bedtime story that introduces basic counting.",
    category: "Bedtime Stories",
    benefit: "Problem Solving",
    price: 13.99,
    images: ["photo-1488590528505-98d2b5aba04b"],
    sponsored: true
  },
  {
    id: 10,
    title: "The Sharing Garden",
    description: "Learn about sharing and cooperation through gardening adventures.",
    category: "Picture Books",
    benefit: "Social Skills",
    price: 14.99,
    images: ["photo-1518770660439-4636190af475"]
  }
];

export const categories = Array.from(new Set(books.map(book => book.category)));
export const benefits = Array.from(new Set(books.map(book => book.benefit)));