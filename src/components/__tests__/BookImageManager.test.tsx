import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookImageManager } from '../BookImageManager';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
  },
}));

describe('BookImageManager Component', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockBook = {
    id: '1',
    title: 'Test Book',
    description: 'Test Description',
    price: 9.99,
    categories: [{ id: '1', name: 'Test Category' }],
    benefit: 'Character Building' as const,
    images: ['test-image-1.jpg', 'test-image-2.jpg'],
    author: 'Test Author',
    sponsored: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    book_link: null,
    status: 'Draft'
  };

  const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('renders all book images', () => {
    renderWithQueryClient(<BookImageManager book={mockBook} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('renders images with correct alt text', () => {
    renderWithQueryClient(<BookImageManager book={mockBook} />);
    const firstImage = screen.getByAltText(`${mockBook.title} - Image 1`);
    const secondImage = screen.getByAltText(`${mockBook.title} - Image 2`);
    expect(firstImage).toBeInTheDocument();
    expect(secondImage).toBeInTheDocument();
  });
});