import { transform } from "./../../utils/common/transform.ts";
import { injectable, inject } from "inversify";
import type { IVocabularyRepository } from "./repository.ts";

import "reflect-metadata";
import type { OpenAIAPI } from "../../api/openai.ts";

import fs from "node:fs";
import path from "node:path";
import { Buffer } from "node:buffer";

export interface IVocabularyService {
  insert(word: string): Promise<any>;
  speech(text: string): Promise<any>;
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
  public async speech(text: string): Promise<any> {
    const res = await this._openai.speech(text);

    const speechFile = path.resolve(`./sound/${text}.mp3`);
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
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
      console.log(content);

      vocabulary = await this._repo.insert({
        ...JSON.parse(content),
        content,
        remark: "-",
      });
    }
    return vocabulary;
  }
}
