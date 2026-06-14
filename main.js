import OpenAI from "openai";
import { TwitterApi } from "twitter-api-v2";
import fs from "node:fs";
import { execSync } from "node:child_process";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const xClient = new TwitterApi({
  clientId: process.env.X_CLIENT_ID,
  clientSecret: process.env.X_CLIENT_SECRET
});

async function main() {
  const {
    client: loggedClient,
    refreshToken
  } = await xClient.refreshOAuth2Token(
    process.env.X_REFRESH_TOKEN
  );

  try {
    execSync(
      `gh secret set X_REFRESH_TOKEN --body "${refreshToken}" --repo zhilang169-hub/x-oauth2-poster`,
      {
        env: {
          ...process.env,
          GH_TOKEN: process.env.GH_TOKEN
        }
      }
    );
    console.log("REFRESH TOKEN SAVED");
  } catch (e) {
    console.log("SECRET UPDATE NG");
    console.log(String(e));
  }

  const result = await client.images.generate({
    model: "gpt-image-1",
    prompt: `今日は${process.env.TODAY}

"今日は何の日"をテーマにする。
subject:
  ethnicity:
    - japanese
  age:
    - 20s adult beautiful woman
  appearance:
    - realistic facial features
    - natural proportions
  expression:
    - playful smile
    - mischievous grin
    - confident eye contact
    - cheerful presenter energy

skin:
  - realistic skin texture
  - visible pores
  - healthy glow
  - natural imperfections
  - photorealistic rendering

makeup:
  - fresh makeup
  - glossy lips
  - subtle highlighter
  - cool-toned eyeshadow
  - natural beauty focus

lighting:
  - bright daylight
  - natural shadows
  - realistic skin reflections
  - commercial photography quality

ポーズはテーマを想起させる体勢にする。

透明アクリルボードは手以外で持つ、出来るだけ体に重ならないようにする。

テーマに関する豆知識や一言コメント、関連する出来事などを考えてアクリルボードにマーカーで記載。
一番最後には『※間違えてたらごめんね』を書く

服装は、テーマを想起させる衣装を前衛的デザインで着こなす、テーマを想起させるアクセサリーや小物を持っている。

camera:
  - eye level
  - front view
  - full body portrait
  - shallow depth of field
  - ultra photorealistic
  - high detail
  - premium DSLR quality

atmosphere:
  - fun
  - inviting
  - educational
  - social media friendly
  - energetic

quality:
  - photorealistic
  - ultra detailed
  - realistic textures
  - natural anatomy
  - premium fashion photography

negative:
  - cheap costume
  - anime style
  - unrealistic anatomy
  - plastic skin
  - excessive retouching
  - low resolution
  - blurry details
  - 読めない文字
`
  });

  console.log("Image generated");

  const imageBase64 = result.data[0].b64_json;
  fs.writeFileSync("image.png", Buffer.from(imageBase64, "base64"));

  console.log("Image saved");

  const mediaClient = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
  });

  const mediaId = await mediaClient.v1.uploadMedia(
    "./image.png",
    {
      mimeType: "image/png",
      target: "tweet"
    }
  );

  await loggedClient.v2.tweet({
    text: "",
    media: {
      media_ids: [mediaId]
    }
  });

  console.log("Posted to X");
}

main().catch(console.error);
