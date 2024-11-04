import { IUserRepository } from './repository.ts';
import { inject, injectable } from "inversify";

type User = {
  username: string;
  password: string;
};

export interface IUserService {
  signIn(username: string, password: string): Promise<any>;
}

@injectable()
export class UserService implements IUserService {

  private _repo: IUserRepository;

  constructor(@inject("UserRepository") repo: IUserRepository) {
    this._repo = repo;
  }

  public async signIn(username: string, password: string) {
    return await this._repo.signIn(username, password);
  }

  // public async insert(u: User) {
  //   const { data, error } = await this._db.from("users").insert([u]);
  //   if (error) {
  //     console.error(error);
  //     throw new Error(`Failed to insert user: ${error.message}`);
  //   }
  //   return data;
  // }
}
