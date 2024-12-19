import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { BookFormFields } from "@/components/BookFormFields";
import { bookFormSchema, type BookFormValues } from "@/schemas/bookSchema";

export default function SubmitBook() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      price: "",
      category: "",
      benefit: "Emotional Intelligence",
      book_link: "",
    },
  });

  const onSubmit = async (data: BookFormValues) => {
    try {
      const { error } = await supabase
        .from('books')
        .insert({
          title: data.title,
          description: data.description,
          author: data.author,
          price: parseFloat(data.price),
          category: data.category,
          benefit: data.benefit,
          book_link: data.book_link || null,
          images: ["placeholder.svg"], // Default placeholder image
          sponsored: false,
          status: 'Draft'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your book has been submitted as a draft.",
      });

      navigate("/");
    } catch (error) {
      console.error('Error submitting book:', error);
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
          <BookFormFields form={form} />
          <Button type="submit" className="w-full">Submit Book as Draft</Button>
        </form>
      </Form>
    </div>
  );
}