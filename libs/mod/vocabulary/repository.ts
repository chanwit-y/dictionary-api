import { Buffer } from "node:buffer";
import { SupabaseDB } from "./../../utils/db/index.ts";
import type { SupabaseClient } from "@supabase/supabase-js";
import { inject, injectable } from "inversify";

import "reflect-metadata";
import type { TUpload, TVocabulary } from "./@types/index.ts";

export interface IVocabularyRepository {
  findAll(): Promise<TVocabulary[]>;
  findByWord(word: string): Promise<TVocabulary[]>;
  insert(v: TVocabulary): Promise<TVocabulary[]>;
  upload(n: string, b: Buffer): Promise<TUpload>;
}

const TableName = "vocabulary";

@injectable()
export class VocabularyRepository implements IVocabularyRepository {
  private _db: SupabaseClient;
  constructor(@inject("SupabaseDB") db: SupabaseDB) {
    this._db = db.instance();
  }

  public async upload(name: string, buff: Buffer): Promise<TUpload> {
    try {
      const { data, error } = await this._db.storage
        .from("speech")
        .upload(`${name}`, buff, {
          contentType: "audio/mpeg",
          cacheControl: "3600",
        });
      if (error) {
        console.error(error);
        throw new Error(`Failed to upload file: ${error.message}`);
      }
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  public async findAll(): Promise<TVocabulary[]> {
    try {
      const { data, error } = await this._db.from(TableName).select("*");
      if (error) {
        console.log(error);
        throw new Error(`Failed to find all words: ${error.message}`);
      }
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to find all words: ${error}`);
    }
  }

  public async findByWord(word: string) {
    try {
      await this._db.auth.refreshSession();
      const { data, error } = await this._db
        .from(TableName)
        .select("*")
        .eq("word", word);
      if (error) {
        console.log(error);
        throw new Error(`Failed to find word: ${error.message}`);
      }
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to find word: ${error}`);
    }
  }

  public async insert(v: TVocabulary) {
    try {
      await this._db.auth.refreshSession();
      const { data, error } = await this._db
        .from(TableName)
        .insert([{ ...v }])
        .select();
      if (error) {
        console.error(error);
        throw new Error(`Failed to insert word: ${error.message}`);
      }
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to insert word: ${error}`);
    }
  }
}
