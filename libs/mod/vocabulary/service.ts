import { injectable, inject } from "inversify";
import type { IVocabularyRepository, VocabularyRepository } from "./repository.ts";
import { OpenAIAPI } from "../../api/openai.api.ts";

import "reflect-metadata";

export interface IVocabularyService {
  insert(word: string): Promise<any>;
  // TODO: move to auth service file
  // auth(): Promise<any>;
  // getUser(token: string): Promise<any>;
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
      vocabulary = await this._repo.insert({
        word,
        content,
        remark: "auto",
      });
    }
    return vocabulary;
  }
}
