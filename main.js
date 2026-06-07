

import sodium from "libsodium-wrappers";
import OpenAI from "openai";
import { TwitterApi } from "twitter-api-v2";
import fs from "node:fs";

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
console.log("SAVE TEST");
console.log(process.env.GH_TOKEN ? "PAT OK" : "PAT NG");

console.log("GH USER TEST");
const userRes = await fetch("https://api.github.com/user", {
  headers: {
    Authorization: `Bearer ${process.env.GH_TOKEN}`,
    Accept: "application/vnd.github+json"
  }
});

console.log(await userRes.text());
console.log("SECRET UPDATE TEST");
console.log("GET PUBLIC KEY");

const keyRes = await fetch(
  "https://api.github.com/repos/zhilang169-hub/x-oauth2-poster/actions/secrets/public-key",
  {
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      Accept: "application/vnd.github+json"
    }
  }
);

const keyData = await keyRes.json();

console.log("KEY_ID=");
console.log(keyData.key_id);

//await sodium.ready;
//const messageBytes = sodium.from_string(refreshToken);
//const keyBytes = sodium.from_base64(
//  keyData.key,
//  sodium.base64_variants.ORIGINAL
//);
//const encryptedBytes =
//  sodium.crypto_box_seal(messageBytes, keyBytes);
//const encryptedValue = sodium.to_base64(
//  encryptedBytes,
//  sodium.base64_variants.ORIGINAL
//);

console.log("SECRET UPDATE");
/*
const updateRes = await fetch(
  "https://api.github.com/repos/zhilang169-hub/x-oauth2-poster/actions/secrets/X_REFRESH_TOKEN",
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      encrypted_value: encryptedValue,
      key_id: keyData.key_id
    })
  }
);

console.log("UPDATE STATUS=");
console.log(updateRes.status);
*/
const res = await fetch(
  "https://api.github.com/repos/zhilang169-hub/x-oauth2-poster",
  {
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      Accept: "application/vnd.github+json"
    }
  }
);

console.log(await res.text());
//   const {
//   client: loggedClient,
 //   accessToken,
//    refreshToken
 // } = await xClient.refreshOAuth2Token(
  //process.env.X_REFRESH_TOKEN
 // );
  
//console.log("NEW REFRESH=");
//console.log(refreshToken);
  
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
