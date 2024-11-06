import { SupabaseDB } from './../../utils/db/index.ts';
import type { AuthTokenResponsePassword, SupabaseClient, UserResponse } from "@supabase/supabase-js";

import { inject, injectable } from "inversify";
import { Instances } from "../../utils/config/container.ts";

export interface IUserRepository {
//   auth(): Promise<any>;
  signIn(username: string, password: string): Promise<AuthTokenResponsePassword>;
  getUser(token: string): Promise<UserResponse>;
}

@injectable()
export class UserRepository implements IUserRepository {
  private _db: SupabaseClient;

  constructor(@inject("SupabaseDB") db: SupabaseDB) {
    this._db = db.instance();
  }

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
