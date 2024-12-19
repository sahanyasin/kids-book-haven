import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  author: z.string().min(1, "Author is required"),
  price: z.string().min(1, "Price is required").transform((val) => parseFloat(val)),
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
  images: z.array(z.string()).min(1, "At least one image is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SubmitBook() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      price: "",
      category: "",
      benefit: "Emotional Intelligence",
      book_link: "",
      images: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase
        .from('books')
        .insert([{
          ...data,
          sponsored: false,
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your book has been submitted successfully.",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your book. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-8">Submit a New Book</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter book title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter book description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Enter author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Enter price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="benefit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefit</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="Emotional Intelligence">Emotional Intelligence</option>
                    <option value="Problem Solving">Problem Solving</option>
                    <option value="Social Skills">Social Skills</option>
                    <option value="Character Building">Character Building</option>
                    <option value="Language Development">Language Development</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="book_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Link (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter book link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images (comma-separated URLs)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter image URLs"
                    onChange={(e) => {
                      const urls = e.target.value.split(',').map(url => url.trim());
                      field.onChange(urls);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Submit Book</Button>
        </form>
      </Form>
    </div>
  );
}