interface LanguageModel {
  create(options: { temperature: number; topK: number }): Promise<Session>;
  capabilities(): Promise<Capabilities>;
}

interface Session {
  promptStreaming(prompt: string): AsyncIterable<string>;
  destroy(): Promise<void>;
  countPromptTokens(prompt: string): Promise<number>;
  maxTokens: number;
  temperature: number;
  tokensLeft: number;
  tokensSoFar: number;
  topK: number;
}

interface Capabilities {
  defaultTopK: number;
  maxTopK: number;
  defaultTemperature: number;
}

interface Window {
  ai?: {
    languageModel: LanguageModel;
  };
}
