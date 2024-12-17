import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/types/books";

const Sitemap = () => {
  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*');
      
      if (error) throw error;
      return data as Book[];
    }
  });

  useEffect(() => {
    const baseUrl = window.location.origin;
    const today = new Date().toISOString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
  ${books.map(book => `
  <url>
    <loc>${baseUrl}/book/${book.id}</loc>
    <lastmod>${book.updated_at || today}</lastmod>
    <priority>0.8</priority>
  </url>`).join('')}
  ${Array.from(new Set(books.map(book => book.category))).map(category => `
  <url>
    <loc>${baseUrl}/category/${encodeURIComponent(category)}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.6</priority>
  </url>`).join('')}
  ${Array.from(new Set(books.map(book => book.benefit))).map(benefit => `
  <url>
    <loc>${baseUrl}/benefit/${encodeURIComponent(benefit)}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

    // Set the content type to XML
    document.documentElement.innerHTML = xml;
    document.documentElement.setAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    document.contentType = 'application/xml';
  }, [books]);

  return null;
};

export default Sitemap;