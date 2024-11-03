import { supabase } from '../../db/index.ts';
import type { SupabaseClient } from "@supabase/supabase-js";

type User = {
  username: string;
  password: string;
};

class UserService {
  constructor(private _db: SupabaseClient) {}

  public async insert(u: User) {
    const { data, error } = await this._db.from("users").insert([u]);
    if (error) {
      console.error(error);
      throw new Error(`Failed to insert user: ${error.message}`);
    }
    return data;
  }
}


export default new UserService(supabase);