import type { SupabaseClient } from "@supabase/supabase-js";
import { injectable } from "inversify";

import "reflect-metadata";
import { supabase } from "../../utils/db/index.ts";
import { Env } from "../../utils/config/index.ts";

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
    // TODO: Fix this
    await this._db.auth.signInWithPassword({
      email: Env.supabaseUser!,
      password: Env.supabasePass!,
      }); 
    const { data, error } = await this._db.from(TableName).insert([{ ...v }]);
    if (error) {
      console.error(error);
      throw new Error(`Failed to insert word: ${error.message}`);
    }
    return data;
  }
}
