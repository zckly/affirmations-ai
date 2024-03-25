import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

export async function textToSpeech({ text }: { text: string }) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: text,
    speed: 0.8,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());

  // return buffer;

  return buffer;
}
