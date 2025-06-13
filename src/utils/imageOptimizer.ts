import { supabase } from "@/integrations/supabase/client";

interface OptimizedImage {
  webpUrl: string;
  fallbackUrl: string;
}

/**
 * Converts an image to WebP format and uploads both WebP and original format
 * @param file The original image file
 * @returns Object containing URLs for both WebP and fallback formats
 */
export const optimizeAndUploadImage = async (file: File): Promise<OptimizedImage> => {
  try {
    // Generate unique filenames for both formats
    const fileExt = file.name.split('.').pop();
    const baseFileName = crypto.randomUUID();
    const webpFileName = `${baseFileName}.webp`;
    const fallbackFileName = `${baseFileName}.${fileExt}`;

    // Convert to WebP
    const webpBlob = await convertToWebP(file);
    
    // Upload both formats
    const [webpUpload, fallbackUpload] = await Promise.all([
      supabase.storage
        .from('book-images')
        .upload(webpFileName, webpBlob),
      supabase.storage
        .from('book-images')
        .upload(fallbackFileName, file)
    ]);

    if (webpUpload.error) throw webpUpload.error;
    if (fallbackUpload.error) throw fallbackUpload.error;

    // Get public URLs
    const { data: { publicUrl: webpUrl } } = supabase.storage
      .from('book-images')
      .getPublicUrl(webpFileName);

    const { data: { publicUrl: fallbackUrl } } = supabase.storage
      .from('book-images')
      .getPublicUrl(fallbackFileName);

    return { webpUrl, fallbackUrl };
  } catch (error) {
    console.error('Error optimizing and uploading image:', error);
    throw error;
  }
};

/**
 * Converts an image file to WebP format
 * @param file The original image file
 * @returns Promise resolving to a Blob containing the WebP image
 */
const convertToWebP = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not convert to WebP'));
          }
        },
        'image/webp',
        0.8 // Quality setting (0.8 = 80% quality)
      );
    };
    
    img.onerror = () => {
      reject(new Error('Could not load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Checks if the browser supports WebP format
 * @returns Promise resolving to a boolean indicating WebP support
 */
export const checkWebPSupport = async (): Promise<boolean> => {
  const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
    img.src = webpData;
  });
}; 