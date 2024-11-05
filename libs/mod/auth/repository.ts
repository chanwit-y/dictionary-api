import type { AuthTokenResponsePassword, SupabaseClient, UserResponse } from "@supabase/supabase-js";

import { injectable } from "inversify";
import { supabase } from "../../utils/db/index.ts";

export interface IUserRepository {
//   auth(): Promise<any>;
  signIn(username: string, password: string): Promise<AuthTokenResponsePassword>;
  getUser(token: string): Promise<UserResponse>;
}

@injectable()
export class UserRepository implements IUserRepository {
  private _db: SupabaseClient = supabase;

  constructor() {}

//   public async auth() {
//     return;
//   }

  public async signIn(username: string, password: string) {
    return await this._db.auth.signInWithPassword({
      email: username,
      password,
    });
  }

  public async getUser(token: string) {
    return await this._db.auth.getUser(token);
  }
}
