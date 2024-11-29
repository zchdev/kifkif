import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PromptService } from '../../services/prompt.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { txtTools } from 'src/app/tools/txtTools';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  // UI Elements
  promptText = '';
  cost = '';
  errorMessage = '';
  rawResponse = '';
  formattedResponse = '';
  generatedResponse: SafeHtml | null = null;
  problematicText = '';
  sessionStats = {
    maxTokens: '',
    temperature: '',
    tokensLeft: '',
    tokensSoFar: '',
    topK: '',
  };
  session: any = null;

  constructor(
    private apiService: PromptService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Check if browser supports the Prompt API
    if (!window['ai'] || !window['ai'].languageModel) {
      this.errorMessage = `Your browser doesn't support the Prompt API. If you're on Chrome, join the 
        <a href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview">Early Preview Program</a> to enable it.`;
      return;
    }

    // Initialize session
    this.updateSession();
  }

  async onSubmit(): Promise<void> {
    let customPrompt;
    !this.promptText.trim()
      ? (customPrompt =
          " the expression 'c'est kif-kif' in french . can you suggest more context  ? ")
      : (customPrompt = `Given this specific item: ${this.promptText}, search for similar or alternative options that match or closely resemble its features, purpose, and quality. The alternatives should be in the same category and provide varied options across different brands, styles, or functionalities. Ensure the recommendations are well-suited to the item type, include both well-known and lesser-known alternatives when relevant.`);

    try {
      const responseStream = await this.apiService.promptStreaming(
        this.session,
        customPrompt
      );
      let fullResponse = '';
      this.rawResponse = '';
      this.formattedResponse = '';
      for await (const chunk of responseStream) {
        fullResponse = chunk.trim();
        this.rawResponse = fullResponse;
        this.formattedResponse = txtTools.parseMarkdown(fullResponse);
        const sanitized = this.sanitizer.bypassSecurityTrustHtml(
          this.formattedResponse
        );
        this.generatedResponse = sanitized;
      }
    } catch (error: any) {
      this.errorMessage = `Error: ${error.message}`;
    } finally {
      this.updateStats();
    }
  }

  resetUI(): void {
    this.rawResponse = '';
    this.formattedResponse = '';
    this.problematicText = '';
    this.sessionStats = {
      maxTokens: '',
      temperature: '',
      tokensLeft: '',
      tokensSoFar: '',
      topK: '',
    };
    this.promptText = '';
  }

  async resetSession(): Promise<void> {
    this.resetUI();
    if (this.session) {
      await this.apiService.destroySession(this.session);
      this.session = null;
    }
    this.updateSession();
  }

  async updateSession(): Promise<void> {
    this.session = await this.apiService.createSession({
      temperature: 2,
      topK: 2,
    });
    this.updateStats();
  }

  updateStats(): void {
    if (!this.session) return;

    const { maxTokens, temperature, tokensLeft, tokensSoFar, topK } =
      this.session;
    this.sessionStats = {
      maxTokens: maxTokens.toLocaleString(),
      temperature: temperature.toFixed(5),
      tokensLeft: tokensLeft.toLocaleString(),
      tokensSoFar: tokensSoFar.toLocaleString(),
      topK: topK.toLocaleString(),
    };
  }
}
