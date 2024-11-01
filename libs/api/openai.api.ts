import { injectable  } from "inversify";
import OpenAI from "openai";
import { Env } from "../config/index.ts";

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
              type: "text",
              text: `คำว่า ${word}  \n- แปลเป็นภาษาไทย\n- คำอ่านในภาษาอังกฤษ\n- ประเภทของคำ \n- ยกตัวอย่างประโยชเป็นภาษาอังกฤษ`,
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
  }
}
