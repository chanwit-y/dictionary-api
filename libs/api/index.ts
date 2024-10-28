
import OpenAI from "openai";
import { Env } from "../config/index.ts";

const openai = new OpenAI({
  apiKey: Env.openaiApiKey,
});

export const translate = async (text: string) => {
  return await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `แปลคำว่า ${text}  ประเภทของคำ แล้วยกตัวอย่างประโยชเป็นภาษาอังกฤษ`,
          },
        ],
      },
    ],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: "text",
    },
  });
};