import { Container } from "inversify";
import {
  VocabularyRepository,
  type IVocabularyRepository,
} from "../../mod/vocabulary/repository.ts";
import { OpenAIAPI } from "../../api/openai.api.ts";
import {
  VocabularyService,
  type IVocabularyService,
} from "../../mod/vocabulary/service.ts";
import {
  UserRepository,
  type IUserRepository,
} from "../../mod/auth/repository.ts";
import { UserService, type IUserService } from "../../mod/auth/service.ts";
import { SupabaseDB, type ISupabaseDB } from "../db/index.ts";

enum Instances {
  SupabaseDB = "SupabaseDB",
  OpenAIAPI = "OpenAIAPI",
  VocabularyRepository = "VocabularyRepository",
  VocabularyService = "VocabularyService",
  UserRepository = "UserRepository",
  UserService = "UserService",
}

const container = new Container();
container.bind<ISupabaseDB>(Instances.SupabaseDB).to(SupabaseDB).inSingletonScope();
container
  .bind<IVocabularyRepository>(Instances.VocabularyRepository)
  .to(VocabularyRepository);
container.bind(Instances.OpenAIAPI).toConstantValue(new OpenAIAPI());
container
  .bind<IVocabularyService>(Instances.VocabularyService)
  .to(VocabularyService);
container.bind<IUserRepository>(Instances.UserRepository).to(UserRepository);
container.bind<IUserService>(Instances.UserService).to(UserService);

export { Instances, container };
