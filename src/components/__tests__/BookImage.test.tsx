import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookImage } from '../BookImage';

describe('BookImage Component', () => {
  const mockProps = {
    src: 'test-image.jpg',
    alt: 'Test Image',
    onRemove: vi.fn(),
    isAdmin: false,
  };

  it('renders image with correct src and alt', () => {
    render(<BookImage {...mockProps} />);
    const image = screen.getByAltText('Test Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  it('does not show remove button for non-admin users', () => {
    render(<BookImage {...mockProps} />);
    const removeButton = screen.queryByLabelText('Remove image');
    expect(removeButton).not.toBeInTheDocument();
  });

  it('shows remove button for admin users', () => {
    render(<BookImage {...mockProps} isAdmin={true} />);
    const removeButton = screen.getByLabelText('Remove image');
    expect(removeButton).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    render(<BookImage {...mockProps} isAdmin={true} />);
    const removeButton = screen.getByLabelText('Remove image');
    fireEvent.click(removeButton);
    expect(mockProps.onRemove).toHaveBeenCalledWith('test-image.jpg');
  });
});