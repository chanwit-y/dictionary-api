import type { VocabularyRepository } from "../repository/vocabulary.repo.ts";
import { OpenAIAPI } from "./../api/openai.api.ts";

export class VocabularyService {
  constructor(
    private _repo: VocabularyRepository,
    private _openai: OpenAIAPI
  ) {}

  public async insert(word: string) {
    let vocabulary;
    vocabulary = await this._repo.findByWord(word);
    if (vocabulary.length === 0) {
      console.log(`call openai: ${word}`);
      const res = await this._openai.translate(word);
      const content = res.choices[0].message.content ?? "";
      vocabulary = await this._repo.insert({
        word,
        content,
        remark: "auto",
      });
    }
    return vocabulary;
  }
}
