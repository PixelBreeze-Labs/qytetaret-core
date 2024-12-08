import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Initialize the Supabase client with your credentials
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!,
    );
  }

  /**
   * Uploads an image to the Supabase storage.
   * @param file The file buffer.
   * @param filename The desired filename.
   * @returns The public URL of the uploaded image.
   */
  async uploadImage(file: Buffer, filename: string): Promise<string> {
    return this.uploadFile(file, `images/${filename}`);
  }

  /**
   * Uploads an audio file to the Supabase storage.
   * @param file The file buffer.
   * @param filename The desired filename.
   * @returns The public URL of the uploaded audio file.
   */
  async uploadAudio(file: Buffer, filename: string): Promise<string> {
    return this.uploadFile(file, `audio/${filename}`);
  }

  /**
   * Deletes a file from Supabase storage.
   * @param filename The full path of the file to delete.
   */
  async delete(filename: string): Promise<void> {
    const { error } = await this.supabase.storage
      // @ts-ignore
      .from(process.env.SUPABASE_BUCKET_NAME)
      .remove([filename]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * A generic file upload function.
   * @param file The file buffer.
   * @param path The storage path for the file.
   * @returns The public URL of the uploaded file.
   */
  private async uploadFile(file: Buffer, path: string): Promise<string> {

    const { data, error } = await this.supabase.storage
      // @ts-ignore
      .from(process.env.SUPABASE_BUCKET_NAME)
      .upload(path, file, { upsert: true });

    if (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }

    
    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET_NAME}/${data.path}`;
    return publicUrl;
  }
}
