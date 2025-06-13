-- Add fallback_url column to book_images table
ALTER TABLE book_images
ADD COLUMN fallback_url TEXT;

-- Update existing records to use the current url as fallback_url
UPDATE book_images
SET fallback_url = url
WHERE fallback_url IS NULL;

-- Add comment to the column
COMMENT ON COLUMN book_images.fallback_url IS 'Fallback URL for browsers that do not support WebP format'; 