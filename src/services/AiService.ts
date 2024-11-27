/* eslint-disable */

type PromptParams = {
  systemPrompt: string;
  temperature: number;
  topK: number;
};

class AiService {
  private static instance: AiService;
  private session: any | null = null;

  private constructor() {}

  /**
   * Retrieves the singleton instance of AiService.
   * @returns {AiService} The singleton instance.
   */
  public static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  /**
   * Initializes a session if one does not already exist and sends a prompt.
   * @param prompt - The prompt to send to the API.
   * @param params - The parameters for the prompt, including system prompt, temperature, and topK.
   * @returns {Promise<string>} The response from the API.
   * @throws {Error} If the prompt fails or the session cannot be created.
   */
  public async runPrompt(
    prompt: string,
    params: PromptParams,
  ): Promise<string> {
    try {
      if (!this.session) {
        this.session = await chrome.aiOriginTrial.languageModel.create(params);
      }
      return this.session.prompt(prompt);
    } catch (e) {
      console.error('Prompt failed', e);
      console.log('Prompt:', prompt);
      await this.reset();
      throw new Error('Failed to run the prompt.');
    }
  }

  /**
   * Resets the current session by destroying it and clearing the reference.
   */
  public async reset(): Promise<void> {
    if (this.session) {
      this.session.destroy();
    }
    this.session = null;
  }

  /**
   * Initializes default parameters for the AI model.
   * @returns {Promise<{ defaultTemperature: number; defaultTopK: number; maxTopK: number }>} Default model settings.
   * @throws {Error} If the AI model is not supported or unavailable.
   */
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
