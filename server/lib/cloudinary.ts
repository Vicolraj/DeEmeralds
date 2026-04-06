import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Standard Cloudinary Node SDK behavior: 
// It automatically picks up CLOUDINARY_URL from process.env if available.
// No manual config({ ... }) is needed if that variable is set.

/**
 * Delete an image from Cloudinary by its public ID
 * @param publicId The public ID of the resource to delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!publicId) return false;
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary deletion result for ${publicId}:`, result);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    return false;
  }
}

export default cloudinary;
