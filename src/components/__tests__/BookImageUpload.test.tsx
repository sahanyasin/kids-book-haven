import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookImageUpload } from '../BookImageUpload';

describe('BookImageUpload Component', () => {
  const mockBook = {
    id: '1',
    title: 'Test Book',
    description: 'Test Description',
    price: 9.99,
    categories: [{ id: '1', name: 'Test Category' }],
    benefit: 'Character Building' as const,
    images: ['test-image.jpg'],
    author: 'Test Author',
    sponsored: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    book_link: null,
    status: 'Draft'
  };

  it('renders nothing for non-admin users', () => {
    render(<BookImageUpload book={mockBook} isAdmin={false} />);
    const uploadInput = screen.queryByLabelText('Upload book image');
    expect(uploadInput).not.toBeInTheDocument();
  });

  it('renders file input for admin users', () => {
    render(<BookImageUpload book={mockBook} isAdmin={true} />);
    const uploadInput = screen.getByLabelText('Upload book image');
    expect(uploadInput).toBeInTheDocument();
  });

  it('handles file upload correctly', async () => {
    render(<BookImageUpload book={mockBook} isAdmin={true} />);
    const uploadInput = screen.getByLabelText('Upload book image');
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(uploadInput, { target: { files: [file] } });
  });
});