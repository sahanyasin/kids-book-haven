import * as z from "zod";

export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must not exceed 1000 characters"),
  author: z.string().min(1, "Author is required").max(100, "Author name must not exceed 100 characters"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number with up to two decimal places").min(1, "Price is required"),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  book_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["Draft", "Published", "Rejected"]).default("Draft"),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;