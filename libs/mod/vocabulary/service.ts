import { injectable, inject } from "inversify";
import type { IVocabularyRepository } from "./repository.ts";

import "reflect-metadata";
import type { OpenAIAPI } from "../../api/openai.ts";

import { Buffer } from "node:buffer";
import type { TUpload, TVocabulary } from "./@types/index.ts";

export interface IVocabularyService {
  // insert(word: string): Promise<TVocabulary[]>;
  // speech(text: string): Promise<TUpload>;
  newWord(word: string): Promise<TVocabulary[]>;
}

@injectable()
export class VocabularyService implements IVocabularyService {
  private _repo: IVocabularyRepository;
  private _openai: OpenAIAPI;

  constructor(
    @inject("VocabularyRepository") repo: IVocabularyRepository,
    @inject("OpenAIAPI") openai: OpenAIAPI
  ) {
    this._repo = repo;
    this._openai = openai;
  }
  private async _askAiForSpeech(text: string): Promise<TUpload> {
    const res = await this._openai.speech(text);
    // console.log(res)
    const buffer = Buffer.from(await res.arrayBuffer());
    return await this._repo.upload(`${text}.mp3`, buffer);
  }

  private async _askAiForMeening(word: string): Promise<string> {
    try {
      const res = await this._openai.translate(word);
      const content = res.choices[0].message.content ?? "";
      return content;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to ask AI: ${error}`);
    }
  }

  private async _insert(data: TVocabulary): Promise<TVocabulary[]> {
    try {
      return await this._repo.insert({
        ...data,
        remark: "-",
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to insert word: ${error}`);
    }
  }

  public async findByWord(word: string): Promise<TVocabulary[]> {
    try {
      const v = await this._repo.findByWord(word);
      // console.log("find by word",v);
      return v;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to check word: ${error}`);
    }
  }

  public async newWord(word: string): Promise<TVocabulary[]> {
    try {
      const v = await this.findByWord(word);
      if (v.length > 0) return v;
      const content = await this._askAiForMeening(word);
      const data: TVocabulary = JSON.parse(content);
      const speech = await this._askAiForSpeech(word);
      const res = await this._insert({ ...data, speech_url: speech.fullPath });
      return res;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to insert word: ${error}`);
    }
  }
}
