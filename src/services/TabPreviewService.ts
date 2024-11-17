import { TabPreview } from '../types/TabPreview';

export class TabPreviewService {
  private static instance: TabPreviewService;

  private constructor() {}

  public static getInstance(): TabPreviewService {
    if (!TabPreviewService.instance) {
      TabPreviewService.instance = new TabPreviewService();
    }
    return TabPreviewService.instance;
  }

  async getCurrentTabPreview(): Promise<TabPreview> {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !tab.url || !tab.title) {
      throw new Error('Unable to retrieve the current tab data.');
    }

    return {
      url: tab.url,
      title: tab.title,
      faviconUrl: tab.favIconUrl || '',
    };
  }
}

export const tabPreviewService = TabPreviewService.getInstance();
