import { PromptPayload } from '../types/PromptPayload';

export type DownloadProgressCallback = (progress: number) => void;

class AiService {
  private static instance: AiService;
  private session: LanguageModel | null = null;

  private constructor() {}

  static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  async getAiCapabilities(): Promise<Availability> {
    return await LanguageModel.availability();
  }

  async getSession(
    onDownloadProgress?: DownloadProgressCallback,
  ): Promise<LanguageModel> {
    try {
      return await LanguageModel.create({
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            onDownloadProgress?.(e.loaded);
          });
        },
        initialPrompts: [
          {
            role: 'system',
            content: `You are an assistant designed to categorize and organize bookmarks into appropriate folders.You will be given a website url, title and available bookmark folders. You will have to choose one or more folders which most fit the provided website url and title from the provided folder list. Output a comma-separated list of folder titles (e.g., "Folder1" or "Folder1, Folder2")`,
          },
          {
            role: 'user',
            content: `Website URL: https://github.com/webmachinelearning/prompt-api, title: webmachinelearning/prompt-api: 💬 A proposal for a web API for prompting browser-provided language models, available folders: , Bookmarks Bar, #TagChoose, Google AI, Chrome Extensions, Gadgets, Software Engineering, Food, Shopping List, Health, Artificial Inteligence, Vilnius, Deals, Youtube Videos, Productivity, Shopify, Things To Buy, Interesting brands, E-commerce, Business, Ideas, Design, Other Bookmarks`,
          },
          {
            role: 'assistant',
            content:
              'Artificial Intelligence, Google AI, Software Engineering, Artificial Inteligence',
          },
          {
            role: 'user',
            content:
              'Website URL: https://tagchoose.site/updates/understanding-initial-ai-model-download/, title: The One-Time AI Model Setup, available folders: , Bookmarks Bar, #TagChoose, Google AI, Chrome Extensions, Gadgets, Software Engineering, Food, Shopping List, Health, Artificial Inteligence, Vilnius, Deals, Youtube Videos, Productivity, Shopify, Things To Buy, Interesting brands, E-commerce, Business, Ideas, Design, Other Bookmarks',
          },
          {
            role: 'assistant',
            content: '#TagChoose, Google AI, Artificial Inteligence',
          },
          {
            role: 'user',
            content:
              'Website URL: https://www.amazon.de/-/en/Playstation%C2%AE5-Digital-slim-Fortnite%C2%AE-Cobalt/dp/B0DK9SN8G1/ref=sr_1_2?dib=eyJ2IjoiMSJ9.ZA1w3xnnDQXvuQy8iexsVKsZzH0uuvb05GfkgpgtMohrzvHDpaRRbe3Y3-gNASX3OCqXse1XuutmXbDjRyX5hpcTfz0Gh3haKFF7Rd9A6Fo2LExWx31CpkHL6k_rS8KKzXmj-dLQgFKhBiTOx2Jp2H8Tlj8G3YbsOD3H7SRG-FBLtr3JxYOdZ9-dJGKwlQzWSoaSubHncoJG_7Wlo9KZ96jfmIEinHAJoIAwNMSW9E8.jHcJgmxAzu70V07GncUa9W-Kcd4iJNY2Cf7KF6M1zRE&dib_tag=se&keywords=playstation+5&nsdOptOutParam=true&qid=1732986960&sr=8-2, title: Playstation®5 Digital Edition (slim) – Fortnite® Cobalt Star Bundle : Amazon.de: PC & Video Games, available folders: , Bookmarks Bar, #TagChoose, Google AI, Chrome Extensions, Gadgets, Software Engineering, Food, Shopping List, Health, Artificial Inteligence, Vilnius, Deals, Youtube Videos, Productivity, Shopify, Things To Buy, Interesting brands, E-commerce, Business, Ideas, Design, Other Bookmarks',
          },
          {
            role: 'assistant',
            content: 'Shopping List, Deals, Things To Buy, Gadgets',
          },
          {
            role: 'user',
            content: `Website URL: "https://www.example.com/blog/typescript-best-practices", title: "TypeScript Best Practices for 2024 - A Complete Guide", available folders: "Work, Programming, TypeScript, Web Development, Learning, Documentation, Tools, Frontend, Backend, JavaScript, React, Angular, Vue, Node.js, Testing, Performance, Security, Architecture, Design Patterns, Clean Code"`,
          },
          {
            role: 'assistant',
            content: 'Programming, TypeScript',
          },
          {
            role: 'user',
            content:
              'Website URL: https://www.niche-beauty.com/en-lt/brands/stora-skuggan-1094, title: STORA SKUGGAN » buy online | NICHE BEAUTY, available folders: , Bookmarks Bar, #TagChoose, Google AI, Chrome Extensions, Gadgets, Software Engineering, Food, Shopping List, Health, Artificial Inteligence, Vilnius, Deals, Youtube Videos, Productivity, Shopify, Things To Buy, Interesting brands, E-commerce, Business, Ideas, Design, Other Bookmarks',
          },
          {
            role: 'assistant',
            content:
              'Shopping List, Interesting brands, Deals, Other Bookmarks',
          },
        ],
      });
    } catch (error) {
      console.error('Failed to create language model session:', error);
      throw new Error('Failed to initialize AI capabilities');
    }
  }

  async runPrompt(payload: PromptPayload): Promise<string> {
    try {
      if (!this.session) {
        this.session = await this.getSession();
      }

      const { url, title, folderListString } = payload;

      const prompt = `Website URL: ${url}, title: ${title}, available folders: ${folderListString}`;

      const response = await this.session.prompt(prompt);

      return response;
    } catch (e) {
      console.error('Prompt failed', e);
      // No need to call reset() anymore as there is no persistent session.
      throw new Error('Failed to run the prompt.');
    }
  }
}

export const aiService = AiService.getInstance();
