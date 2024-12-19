import * as z from "zod";

export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  author: z.string().min(1, "Author is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  benefit: z.enum([
    "Emotional Intelligence",
    "Problem Solving",
    "Social Skills",
    "Character Building",
    "Language Development"
  ], {
    required_error: "Please select a benefit category",
  }),
  book_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  images: z.string().transform(str => str.split(',').map(s => s.trim())).pipe(
    z.array(z.string()).min(1, "At least one image is required")
  ),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;