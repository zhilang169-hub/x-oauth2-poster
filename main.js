import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  console.log("OpenAI connected");

  const response = await client.responses.create({
    model: "gpt-5",
    input: "Say hello"
  });

  console.log(response.output_text);
}

main().catch(console.error);
