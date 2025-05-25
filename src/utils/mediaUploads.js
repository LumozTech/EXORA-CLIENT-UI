import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Upload media file to Supabase storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The storage bucket to use ('products' or 'profiles')
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export const uploadMediaToSupabase = async (file, bucket = 'products') => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Validate bucket type
  if (!['products', 'profiles'].includes(bucket)) {
    throw new Error("Invalid bucket type. Must be 'products' or 'profiles'");
  }

  try {
    // Generate unique filename with timestamp
    const timeStamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timeStamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    if (!data?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    return data.publicUrl;
  } catch (error) {
    console.error("Supabase upload error:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Delete media file from Supabase storage
 * @param {string} fileUrl - The public URL of the file to delete
 * @param {string} bucket - The storage bucket containing the file
 * @returns {Promise<void>}
 */
export const deleteMediaFromSupabase = async (fileUrl, bucket = 'products') => {
  if (!fileUrl) {
    throw new Error("No file URL provided");
  }

  try {
    // Extract filename from URL
    const fileName = fileUrl.split('/').pop();
    
    // Delete file from Supabase storage
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (deleteError) {
      throw new Error(`Delete failed: ${deleteError.message}`);
    }
  } catch (error) {
    console.error("Supabase delete error:", error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};
