import type { SupabaseClient } from "@supabase/supabase-js";
import { injectable } from "inversify";
import { Env } from "../config/index.ts";
import { supabase } from "../db/index.ts";

import "reflect-metadata";

type TVocabulary = {
  word: string;
  content: string;
  remark: string;
};

export interface IVocabularyRepository {
  findAll(): Promise<unknown>;
  findByWord(word: string): Promise<any[]>;
  insert(v: TVocabulary): Promise<unknown>;
}

const TableName = "vocabulary";

@injectable()
export class VocabularyRepository implements IVocabularyRepository {
  private _db: SupabaseClient = supabase;
  constructor() {}

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
    const auth = await this._db.auth.signInWithPassword({
      email: Env.supabaseUser!,
      password: Env.supabasePass!,
    });
    console.log("auth", auth);
    const { data, error } = await this._db.from(TableName).insert([{ ...v }]);
    if (error) {
      console.error(error);
      throw new Error(`Failed to insert word: ${error.message}`);
    }
    return data;
  }
}
