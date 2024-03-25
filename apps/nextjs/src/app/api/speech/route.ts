import { textToSpeech } from "../openai";
import { uploadFile } from "../supabase";

export async function POST(req: Request) {
  const { lines } = (await req.json()) as { lines: string[] };

  console.log({ lines });
  // Go through each line and convert to speech
  const speechBuffers = await Promise.all(
    lines.map(async (line) => {
      const speechBuffer = await textToSpeech({
        text: line,
      });
      return speechBuffer;
    }),
  );

  console.log("made speechbuffers");

  // go through each buffer and upload to supabase
  const uploadedPaths = await Promise.all(
    speechBuffers.map(async (buffer) => {
      const uploadedPath = await uploadFile(buffer);
      return uploadedPath;
    }),
  );

  return Response.json({
    paths: uploadedPaths,
  });
}
