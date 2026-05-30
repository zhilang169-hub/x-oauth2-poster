import OpenAI from "openai";
import { TwitterApi } from "twitter-api-v2";
import fs from "node:fs";

console.log("VERSION-X-POST");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const xClient = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET
});

async function main() {
  const result = await client.images.generate({
    model: "gpt-image-1",
    prompt: "A cute Shiba Inu sitting in a Japanese garden, photorealistic"
  });

  console.log("Image generated");
  const imageBase64 = result.data[0].b64_json;
  fs.writeFileSync("image.png", Buffer.from(imageBase64, "base64"));
  console.log("Image saved");

  const mediaId = await xClient.v1.uploadMedia("image.png", {
  mimeType: "image/png"
});

  console.log("Media uploaded");

  await xClient.v2.tweet({
  text: "GitHub Actionsから画像投稿テスト",
  media: {
    media_ids: [mediaId]
  }
});

console.log("Posted to X");
}

main().catch(console.error);
