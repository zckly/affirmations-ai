import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE ?? "",
);

// Upload file using standard upload
export async function uploadFile(file: Buffer) {
  const newFilePath = `${nanoid()}.mp3`;
  const { data, error } = await supabase.storage
    .from("audio-files")
    .upload(newFilePath, file);
  if (error) {
    // Handle error
    console.error(error);
  } else {
    // Handle success
    console.log({ data });
    return data.path;
  }
}
