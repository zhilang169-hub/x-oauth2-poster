
import OpenAI from "openai";
import { TwitterApi } from "twitter-api-v2";
import fs from "node:fs";
import crypto from "node:crypto";
import { execSync } from "node:child_process";
//import sodium from "libsodium-wrappers";

//console.log("VERSION-X-POST");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const xClient = new TwitterApi({
  clientId: process.env.X_CLIENT_ID,
  clientSecret: process.env.X_CLIENT_SECRET
});

async function main() {
  /*
  console.log("X_CLIENT_ID=");
  console.log(process.env.X_CLIENT_ID?.substring(0, 30));
  console.log(process.env.X_CLIENT_ID?.length);
  console.log("X_CLIENT_SECRET=");
  console.log(process.env.X_CLIENT_SECRET?.substring(0, 30));
  console.log(process.env.X_CLIENT_SECRET?.length);
  console.log("X_REFRESH_TOKEN=");
  console.log(process.env.X_REFRESH_TOKEN?.substring(0, 30));
  console.log(process.env.X_REFRESH_TOKEN?.length);
  
  console.log("BEFORE REFRESH");
  */
  //const {
  //client: loggedClient
//
 // } = await xClient.refreshOAuth2Token(
//  process.env.X_REFRESH_TOKEN
//  );
  
//  const {
 // client: loggedClient,
//  accessToken,
 // refreshToken
//} = await xClient.refreshOAuth2Token(
//  process.env.X_REFRESH_TOKEN
//);

//  console.log("NEW_ACCESS_TOKEN=");
//console.log(accessToken);
  
const {
  client: loggedClient,
  refreshToken
} = await xClient.refreshOAuth2Token(
  process.env.X_REFRESH_TOKEN
);
/*
console.log("NEW_REFRESH_TOKEN=");
console.log(refreshToken);

console.log("REFRESH LENGTH=");
console.log(refreshToken.length);
console.log("GH CLI TEST");
*/
try {
  const version = execSync("gh --version").toString();
  console.log(version);
} catch (e) {
  console.log("GH CLI NG");
}

// console.log("GH SECRET TEST");

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
//  console.log("SECRET UPDATE OK");
} catch (e) {
  console.log("SECRET UPDATE NG");
  console.log(String(e));
} 
  
//console.log("AFTER REFRESH");
console.log(await loggedClient.v2.me());
const result = await client.images.generate({
  model: "gpt-image-1",
  prompt: `今日は${process.env.TODAY}

"今日は何の日"をテーマにする。
subject:
  ethnicity:
    - East Asian
  age:
    - 20s adult woman
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
` });

console.log("Image generated");
const imageBase64 = result.data[0].b64_json;
  fs.writeFileSync("image.png", Buffer.from(imageBase64, "base64"));
  console.log("Image saved");

  /*本番用
  console.log("START UPLOAD");
  console.log(await loggedClient.v2.me());
  
  const mediaId = await loggedClient.v1.uploadMedia("image.png", {
  mimeType: "image/png"  });
  console.log(mediaId);
  console.log("UPLOAD OK");
  console.log("Media uploaded");
  await loggedClient.v2.tweet({
  text: "GitHub Actionsから画像投稿テスト",
  media: {
    media_ids: [mediaId]
  } 
});
*/
  console.log("START UPLOAD");
console.log(await loggedClient.v2.me());

console.log("FILE EXISTS");
console.log(fs.existsSync("image.png"));

const stat = fs.statSync("image.png");
console.log("FILE SIZE");
console.log(stat.size);

console.log("CLIENT TYPE");
console.log(loggedClient.constructor.name);

console.log("AUTH OK");
console.log(await loggedClient.v2.me());
console.log("USER ID");
console.log((await loggedClient.v2.me()).data.id);
console.log("TRY TEXT TWEET");

await loggedClient.v2.tweet({

   `テスト ${Date.now()}`

});

console.log("TEXT TWEET SUCCESS");


try {
    console.log("TRY SMALL IMAGE");

const mediaId = await loggedClient.v1.uploadMedia(
  "./image.png",
  {
    mimeType: "image/png",
    target: "tweet"
  }
);

console.log(mediaId);

    console.log("MEDIA ID =", mediaId);
    console.log("UPLOAD OK");
    console.log("Media uploaded");

    await loggedClient.v2.tweet({
      text: "画像投稿テスト",
      media: {
        media_ids: [mediaId]
      }
    });

} catch (e) {
    console.log("UPLOAD ERROR");
    console.log("CODE =", e.code);
    console.log("HEADERS =", JSON.stringify(e.headers, null, 2));
    console.log("DATA =", JSON.stringify(e.data, null, 2));
}
//  await loggedClient.v2.tweet({
//  text: `テスト投稿 ${Date.now()}`
//});

console.log("TEXT POST OK");
    

console.log("Posted to X");
}

main().catch(console.error);
