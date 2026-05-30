import OpenAI from "openai";
import fs from "node:fs";

console.log("VERSION-X-POST");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const result = await client.images.generate({
    model: "gpt-image-1",
    prompt: "A cute Shiba Inu sitting in a Japanese garden, photorealistic"
  });

  console.log("Image generated");
}

main().catch(console.error);
