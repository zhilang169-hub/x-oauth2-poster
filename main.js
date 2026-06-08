
import OpenAI from "openai";
import { TwitterApi } from "twitter-api-v2";
import fs from "node:fs";
import crypto from "node:crypto";
import { execSync } from "node:child_process";
//import sodium from "libsodium-wrappers";

console.log("VERSION-X-POST");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const xClient = new TwitterApi({
  clientId: process.env.X_CLIENT_ID,
  clientSecret: process.env.X_CLIENT_SECRET
});

async function main() {
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

console.log("NEW_REFRESH_TOKEN=");
console.log(refreshToken);

console.log("REFRESH LENGTH=");
console.log(refreshToken.length);
console.log("GH CLI TEST");

try {
  const version = execSync("gh --version").toString();
  console.log(version);
} catch (e) {
  console.log("GH CLI NG");
}

 console.log("GH SECRET TEST");

try {
  execSync(
    `gh secret set TEST_SECRET --body "${Date.now()}" --repo zhilang169-hub/x-oauth2-poster`,
    {
      env: {
        ...process.env,
        GH_TOKEN: process.env.GH_TOKEN
      }
    }
  );

  console.log("SECRET UPDATE OK");
} catch (e) {
  console.log("SECRET UPDATE NG");
  console.log(String(e));
} 
  
console.log("AFTER REFRESH");
console.log(await loggedClient.v2.me());
////  const result = await client.images.generate({
////    model: "gpt-image-1",
////    prompt: "A cute Shiba Inu sitting in a Japanese garden, photorealistic"
////  });

////  console.log("Image generated");
////  const imageBase64 = result.data[0].b64_json;
////  fs.writeFileSync("image.png", Buffer.from(imageBase64, "base64"));
  console.log("Image saved");

  console.log("START UPLOAD");
  console.log(await loggedClient.v2.me());
  
//  const mediaId = await loggedClient.v1.uploadMedia("image.png", {
  //mimeType: "image/png"  });
  //console.log(mediaId);
  //console.log("UPLOAD OK");
  //console.log("Media uploaded");
  //await loggedClient.v2.tweet({
  //text: "GitHub Actionsから画像投稿テスト",
  //media: {
   // media_ids: [mediaId]
  //} 
//});
  
  await loggedClient.v2.tweet({
  text: `テスト投稿 ${Date.now()}`
});

console.log("TEXT POST OK");
    

console.log("Posted to X");
}

main().catch(console.error);
