import { injectable } from "inversify";
import OpenAI from "openai";
import { Env } from "../utils/config/index.ts";
// import path from "node:path";

// import { Buffer } from "node:buffer";
// import fs from "node:fs";

const openai = new OpenAI({
  apiKey: Env.openaiApiKey,
});

@injectable()
export class OpenAIAPI {
  public async translate(word: string) {
    return await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              text: `ตอบกลับเป็น json\n{\n   "word": "${word}",\n   "thai": "...", //แปลคำว่า ${word} เป็นภาษาไทยของคำว่า \n   "english": "...", //คำอ่านและการออกเสียง ${word} เป็นภาษาไทย\n   "types": [...], //ประเภทของคำของคำว่า ${word}\n   "examples": [...], //ตัวอย่างการใช้คำว่า ${word} ในประเภทคำต่างๆ แค่ sentence เท่านั้น\n}`,
              type: "text",
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
        type: "json_object",
      },
    });
  }

  public async speech(text: string) {
    const res = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    return res;
    // console.log(mp3);
  }
}
