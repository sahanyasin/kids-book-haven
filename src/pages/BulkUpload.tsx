import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

const BulkUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setMessage('');
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setMessage('Processing file...');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const booksData = JSON.parse(text);

        if (!Array.isArray(booksData)) {
          setMessage('Error: JSON file must contain an array of book objects.');
          setLoading(false);
          return;
        }

        let successfulUploads = 0;
        let failedUploads = 0;
        const totalBooks = booksData.length;

        for (const book of booksData) {
          try {
            setMessage(`Processing book ${successfulUploads + failedUploads + 1} of ${totalBooks}...`);

            // First insert the book
            const { data: newBook, error: bookError } = await supabase
              .from('books')
              .insert({
                title: book.title,
                author: book.author,
                description: book.description || book.summary,
                price: book.price || 0,
                sponsored: book.sponsored || false,
                book_link: book.amazon_link || null,
                status: 'Published',
                images: [],
              })
              .select()
              .single();

            if (bookError) {
              console.error('Error inserting book:', book.title, bookError);
              failedUploads++;
              continue;
            }

            // Then insert the benefits if any
            if (Array.isArray(book.benefits) && book.benefits.length > 0 && newBook?.id) {
              const { error: benefitsError } = await supabase
                .from('book_benefits')
                .insert(
                  book.benefits.map(benefitName => ({
                    book_id: newBook.id,
                    benefit_id: benefitName // Assuming the JSON contains benefit names that match the database
                  }))
                );

              if (benefitsError) {
                console.error('Error inserting benefits for book:', book.title, benefitsError);
              }
            }

            if (book.img_link && newBook?.id) {
              const { error: imgError } = await supabase
                .from('book_images')
                .insert({
                  book_id: newBook.id,
                  url: book.img_link,
                  order_index: 0,
                });

              if (imgError) {
                console.error('Error inserting image for book:', book.title, imgError);
              }
            }
            successfulUploads++;
          } catch (individualBookError) {
            console.error('Error processing individual book:', book.title, individualBookError);
            failedUploads++;
          }
        }

        setMessage(`Upload complete: ${successfulUploads} books added, ${failedUploads} failed.`);
      } catch (error) {
        console.error('Error reading or parsing file:', error);
        setMessage('Error reading or parsing file. Please ensure it is a valid JSON.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Bulk Book Upload</CardTitle>
          <CardDescription>Upload a JSON file containing book data to add multiple books at once.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="json-file">JSON File</Label>
              <Input id="json-file" type="file" accept=".json,.txt" onChange={handleFileChange} />
            </div>
            <Button onClick={handleUpload} disabled={!selectedFile || loading}>
              {loading ? 'Uploading...' : 'Upload Books'}
            </Button>
            {message && <p className={`text-sm mt-2 ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUpload; 