const SYSTEM_PROMPT = `You are a highly intelligent and efficient assistant designed to categorize and organize bookmarks into appropriate folders.`;

class AiService {
  private static instance: AiService;

  private session: typeof chrome.aiOriginTrial.session = null;

  private constructor() {}

  static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  async getAiCapabilities(): Promise<
    AILanguageModelCapabilities | 'unsupported'
  > {
    if (!('aiOriginTrial' in chrome)) {
      return 'unsupported';
    }

    return await chrome.aiOriginTrial.languageModel.capabilities();
  }

  async runPrompt(
    prompt: string,
    config: {
      temperature: number;
      topK: number;
    },
  ): Promise<string> {
    try {
      if (!this.session) {
        this.session = await chrome.aiOriginTrial.languageModel.create({
          systemPrompt: SYSTEM_PROMPT,
          ...config,
        });
      }

      return this.session.prompt(prompt);
    } catch (e) {
      console.error('Prompt failed', e);

      await this.reset();
      throw new Error('Failed to run the prompt.');
    }
  }

  async reset(): Promise<void> {
    if (this.session) {
      this.session.destroy();
    }

    this.session = null;
  }
}

export const aiService = AiService.getInstance();
