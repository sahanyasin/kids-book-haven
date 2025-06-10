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
      benefits: [],
      book_link: "",
      status: "Draft",
    },
  });

  const onSubmit = async (data: BookFormValues) => {
    try {
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .insert({
          title: data.title,
          description: data.description,
          author: data.author,
          price: parseFloat(data.price),
          book_link: data.book_link || null,
          sponsored: false,
          status: 'Draft'
        })
        .select('id')
        .single();

      if (bookError) throw bookError;
      if (!bookData) throw new Error('Failed to create book');

      const { error: benefitsError } = await supabase
        .from('book_benefits')
        .insert(
          data.benefits.map(benefitId => ({
            book_id: bookData.id,
            benefit_id: benefitId
          }))
        );

      if (benefitsError) throw benefitsError;

      toast({
        title: "Success!",
        description: "Your book has been submitted as a draft.",
      });

      navigate("/");
    } catch (error: any) {
      console.error('Error submitting book:', error);
      let errorMessage = "There was a problem submitting your book. Please try again.";

      if (error.code === '23505') { // Unique violation error code
        errorMessage = "A book with this title already exists. Please choose a different title.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
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