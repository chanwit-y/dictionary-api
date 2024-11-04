import type { SupabaseClient } from "@supabase/supabase-js";

import { injectable } from "inversify";
import { supabase } from "../../db/index.ts";

export interface IUserRepository {
//   auth(): Promise<any>;
  signIn(username: string, password: string): Promise<any>;
//   getUser(token: string): Promise<any>;
}

@injectable()
export class UserRepository implements IUserRepository {
  private _db: SupabaseClient = supabase;

  constructor() {}

//   public async auth() {
//     return;
//   }

  public async signIn(username: string, password: string) {
    const res = await this._db.auth.signInWithPassword({
      email: username,
      password,
    });
    return res;
  }

//   public async getUser(token: string) {
//     return;
//   }
}
