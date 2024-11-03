import { Container } from "inversify";
import {
  VocabularyRepository,
  type IVocabularyRepository,
} from "../mod/vocabulary/repository.ts";
import { OpenAIAPI } from "../api/openai.api.ts";
import {
  VocabularyService,
  type IVocabularyService,
} from "../mod/vocabulary/service.ts";

enum Instances {
  OpenAIAPI = "OpenAIAPI",
  VocabularyRepository = "VocabularyRepository",
  VocabularyService = "VocabularyService",
}

const container = new Container();
container
  .bind<IVocabularyRepository>(Instances.VocabularyRepository)
  .to(VocabularyRepository);
container.bind(Instances.OpenAIAPI).toConstantValue(new OpenAIAPI());
container
  .bind<IVocabularyService>(Instances.VocabularyService)
  .to(VocabularyService);

  export {Instances, container}