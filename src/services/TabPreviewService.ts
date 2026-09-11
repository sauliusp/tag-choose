import { TabPreview } from '../types/TabPreview';
export class TabPreviewService {
  async getCurrentTabPreview(): Promise<TabPreview> {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.url)
      throw new Error(
        'Could not read the current page. Reopen TagChoose on a website.',
      );
    if (!/^(https?|file|ftp):/i.test(tab.url))
      throw new Error(
        'Open a website or file to bookmark. Browser settings and extension pages cannot be saved here.',
      );
    // No remote fallback image requests from the popup.
    return {
      url: tab.url,
      title: tab.title?.trim() || tab.url,
      faviconUrl: '',
    };
  }
}
export const tabPreviewService = new TabPreviewService();
