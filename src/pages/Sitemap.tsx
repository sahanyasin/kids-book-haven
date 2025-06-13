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
        .select(`
          id,
          title,
          description,
          price,
          benefits:book_benefits(
            benefit:benefits(
              id,
              name
            )
          ),
          sponsored,
          images,
          author,
          book_link,
          created_at,
          updated_at,
          status,
          categories:book_categories(
            category:categories(
              id,
              name
            )
          )
        `);
      
      if (error) throw error;
      
      return data.map(book => ({
        ...book,
        categories: book.categories.map((cat: any) => cat.category),
        benefits: book.benefits ? book.benefits.map((bb: any) => bb.benefit).filter(Boolean) : []
      })) as Book[];
    }
  });

  useEffect(() => {
    const baseUrl = window.location.origin;
    const today = new Date().toISOString();

    // Statik sayfalar için sabit tarih (son güncelleme tarihi)
    const staticPagesLastmod = "2024-03-20T00:00:00.000Z";

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Ana Sayfa -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Statik Sayfalar -->
  <url>
    <loc>${baseUrl}/submit-book</loc>
    <lastmod>${staticPagesLastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/login</loc>
    <lastmod>${staticPagesLastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/profile</loc>
    <lastmod>${staticPagesLastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Kitap Detay Sayfaları -->
  ${books.map(book => `
  <url>
    <loc>${baseUrl}/book/${book.id}</loc>
    <lastmod>${book.updated_at || book.created_at || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

  <!-- Kategori Sayfaları -->
  ${Array.from(new Set(books.flatMap(book => book.categories.map(cat => cat.name)))).map(category => `
  <url>
    <loc>${baseUrl}/category/${encodeURIComponent(category)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}

  <!-- Fayda Sayfaları -->
  ${Array.from(new Set(books.flatMap(book => book.benefits.map(benefit => benefit.name)))).map(benefit => `
  <url>
    <loc>${baseUrl}/benefit/${encodeURIComponent(benefit)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

    document.open('text/xml');
    document.write(xml);
    document.close();
  }, [books]);

  return null;
};

export default Sitemap;