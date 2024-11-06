import { injectable } from 'inversify';
import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { Env } from "../config/index.ts";

export interface ISupabaseDB {
  instance: () => SupabaseClient;
}

@injectable()
export class SupabaseDB implements ISupabaseDB {
  private _db: SupabaseClient;

  constructor() {
    const supabaseUrl = Env.supabaseUrl ?? "";
    const supabaseKey = Env.supabaseKey ?? "";
    this._db = createClient(supabaseUrl, supabaseKey);
  }

  public instance(): SupabaseClient {
    return this._db;
  }
}

// export const findAll = async (table: string) => {
//   let { data: eng_to_tha, error } = await supabase
//     .from("eng_to_tha")
//     .select("*");
//   if (error) {
//     console.log(error);
//     return error;
//   }
//   console.log(eng_to_tha);
//   return eng_to_tha;
// };
