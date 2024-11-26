export type TVocabulary = {
  word: string;
  content: string;
  remark: string;
  thai: string;
  english: string;
  types: string[];
  examples: string[];
  speech_url: string;
};

export type TUpload = {
  id: string;
  path: string;
  fullPath: string;
};
