import { Buffer } from "node:buffer";
import { SupabaseDB } from "./../../utils/db/index.ts";
import type { SupabaseClient } from "@supabase/supabase-js";
import { inject, injectable } from "inversify";

import "reflect-metadata";
import { Env } from "../../utils/config/index.ts";
import { Instances } from "../../utils/config/container.ts";

type TVocabulary = {
  word: string;
  content: string;
  remark: string;
  thai: string;
  english: string;
  type: string;
  example: string;
};

export interface IVocabularyRepository {
  findAll(): Promise<unknown>;
  findByWord(word: string): Promise<any[]>;
  insert(v: TVocabulary): Promise<unknown>;
  upload(n: string, b: Buffer): Promise<any>;
}

const TableName = "vocabulary";

@injectable()
export class VocabularyRepository implements IVocabularyRepository {
  private _db: SupabaseClient;
  constructor(@inject("SupabaseDB") db: SupabaseDB) {
    this._db = db.instance();
  }
  public async upload(n: string,b: Buffer): Promise<any> {
    
    const { data, error } = await this._db.storage
      .from("speech")
      .upload(`${n}`, b, {
        cacheControl: "3600",
        // upsert: false,
      });
    if (error) {
      console.error(error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    return data;
  }

  public async findAll() {
    const { data, error } = await this._db.from(TableName).select("*");
    if (error) {
      console.log(error);
      return error;
    }
    return data;
  }

  public async findByWord(word: string) {
    const { data, error } = await this._db
      .from(TableName)
      .select("*")
      .eq("word", word);
    if (error) {
      console.log(error);
      throw new Error(`Failed to find word: ${error.message}`);
    }
    return data;
  }
  public async insert(v: TVocabulary) {
    const { data, error } = await this._db
      .from(TableName)
      .insert([{ ...v }])
      .select();
    if (error) {
      console.error(error);
      throw new Error(`Failed to insert word: ${error.message}`);
    }
    return data;
  }
}
