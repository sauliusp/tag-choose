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
            content: `Website URL: "https://www.example.com/blog/typescript-best-practices", title: "TypeScript Best Practices for 2024 - A Complete Guide", available folders: "Work, Programming, TypeScript, Web Development, Learning, Documentation, Tools, Frontend, Backend, JavaScript, React, Angular, Vue, Node.js, Testing, Performance, Security, Architecture, Design Patterns, Clean Code"`,
          },
          {
            role: 'assistant',
            content: 'Programming, TypeScript',
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

      return await this.session.prompt(
        `Website URL: ${url}, title: ${title}, available folders: ${folderListString}`,
      );
    } catch (e) {
      console.error('Prompt failed', e);
      // No need to call reset() anymore as there is no persistent session.
      throw new Error('Failed to run the prompt.');
    }
  }
}

export const aiService = AiService.getInstance();
