import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side Supabase client with service role key (bypasses RLS)
export function getSupabaseStorage() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null; // Fall back to local storage if not configured
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  return supabase.storage;
}

const BUCKET_NAME = "vendor-photos";

/**
 * Upload a photo to Supabase Storage.
 * Returns the public URL of the uploaded file.
 * Falls back to null if Supabase is not configured (caller handles local fallback).
 */
export async function uploadPhoto(
  vendorId: string,
  filename: string,
  fileBuffer: ArrayBuffer,
  contentType: string
): Promise<{ url: string; path: string } | null> {
  const storage = getSupabaseStorage();
  if (!storage) return null;

  const path = `${vendorId}/${filename}`;

  const { error } = await storage.from(BUCKET_NAME).upload(path, fileBuffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    console.error("Supabase upload error:", error.message);
    return null;
  }

  // Get public URL
  const { data: urlData } = storage.from(BUCKET_NAME).getPublicUrl(path);
  return { url: urlData.publicUrl, path };
}

/**
 * Delete a photo from Supabase Storage.
 */
export async function deletePhoto(path: string): Promise<boolean> {
  const storage = getSupabaseStorage();
  if (!storage) return false;

  const { error } = await storage.from(BUCKET_NAME).remove([path]);
  if (error) {
    console.error("Supabase delete error:", error.message);
    return false;
  }
  return true;
}

/**
 * Check if Supabase Storage is configured.
 */
export function isStorageConfigured(): boolean {
  return !!(supabaseUrl && supabaseServiceKey);
}
