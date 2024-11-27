import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  private aiModel = window['ai']?.languageModel;

  async createSession(options: {
    temperature: number;
    topK: number;
  }): Promise<any> {
    if (!this.aiModel)
      throw new Error('AI Model is unavailable in this browser.');

    return this.aiModel.create({
      temperature: options.temperature,
      topK: options.topK,
    });
  }

  async promptStreaming(
    session: any,
    prompt: string
  ): Promise<AsyncIterable<string>> {
    if (!session) throw new Error('Session is not initialized.');

    return session.promptStreaming(prompt);
  }

  async destroySession(session: any): Promise<void> {
    if (session) {
      await session.destroy();
    }
  }
}
