import { PromptConfig } from '../types/PromptConfig';

class AiService {
  private static instance: AiService;

  // @ts-expect-error: still waiting for the @chrome/types to be updated
  private session = null;

  private constructor() {}

  public static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  public async runPrompt(
    prompt: string,
    params: PromptConfig,
  ): Promise<string> {
    try {
      if (!this.session) {
        this.session = await chrome.aiOriginTrial.languageModel.create(params);
      }

      return this.session.prompt(prompt);
    } catch (e) {
      console.error('Prompt failed', e);

      await this.reset();
      throw new Error('Failed to run the prompt.');
    }
  }

  public async reset(): Promise<void> {
    if (this.session) {
      this.session.destroy();
    }

    this.session = null;
  }

  public async initDefaults(): Promise<{
    defaultTemperature: number;
    defaultTopK: number;
    maxTopK: number;
  }> {
    if (!('aiOriginTrial' in chrome)) {
      throw new Error(
        'Error: chrome.aiOriginTrial not supported in this browser',
      );
    }

    const defaults = await chrome.aiOriginTrial.languageModel.capabilities();

    if (defaults.available !== 'readily') {
      throw new Error(
        `Model not yet available (current state: "${defaults.available}")`,
      );
    }

    return {
      defaultTemperature: defaults.defaultTemperature,
      defaultTopK: Math.min(defaults.defaultTopK, 3),
      maxTopK: defaults.maxTopK,
    };
  }
}

export const aiService = AiService.getInstance();
