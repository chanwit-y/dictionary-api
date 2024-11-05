import { transform } from './../../utils/common/transform.ts';
import { injectable, inject } from "inversify";
import type { IVocabularyRepository } from "./repository.ts";
import { OpenAIAPI } from "../../api/openai.api.ts";

import "reflect-metadata";

export interface IVocabularyService {
  insert(word: string): Promise<any>;
}

@injectable()
export class VocabularyService implements IVocabularyService {
  // constructor(private _repo: VocabularyRepository, private _openai: OpenAIAPI) {}
  private _repo: IVocabularyRepository;
  private _openai: OpenAIAPI;

  constructor(
    @inject("VocabularyRepository") repo: IVocabularyRepository,
    @inject("OpenAIAPI") openai: OpenAIAPI
  ) {
    this._repo = repo;
    this._openai = openai;
  }

  // public async auth() {
  //   const res = await this._repo.auth();
  //   return res;
  // }

  // public async getUser(token: string) {
  //   const res = await this._repo.getUser(token);
  //   return res;
  // }

  public async insert(word: string) {
    let vocabulary;
    vocabulary = await this._repo.findByWord(word);
    if (vocabulary.length === 0) {
      console.log(`call openai: ${word}`);
      const res = await this._openai.translate(word);
      const content = res.choices[0].message.content ?? "";
      const {thai, english, example, type, remark} = transform(content);
      console.log("==============")
      console.log(content)
      // console.log(data);
      console.log("==============")
      vocabulary = await this._repo.insert({
        word,
        content,
        remark,
        thai,
        english,
        type,
        example,
      });
    }
    return vocabulary;
  }
}
