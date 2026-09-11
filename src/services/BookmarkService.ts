import { Folder } from '../types/Folder';
import { Bookmark } from '../types/Bookmark';
import { SavedTab } from '../types/SavedTab';

export function writableFolders(
  nodes: chrome.bookmarks.BookmarkTreeNode[],
  parents: string[] = [],
  blocked = false,
): Folder[] {
  return nodes.flatMap((node) => {
    const readOnly = blocked || !!node.unmodifiable;
    if (node.url || readOnly) return [];
    const path = node.title ? [...parents, node.title] : parents;
    const folder =
      node.id !== '0' && node.parentId
        ? [{ ...node, children: undefined, path: path.join(' / ') }]
        : [];
    return [...folder, ...writableFolders(node.children ?? [], path, readOnly)];
  });
}

export class BookmarkService {
  async getAllFolders(): Promise<Folder[]> {
    return writableFolders(await chrome.bookmarks.getTree());
  }

  async upsertBookmarkInMultipleFolders(
    folderIds: string[],
    title: string,
    url: string,
  ): Promise<{ updated: number; created: number }> {
    title = title.trim();
    if (!title || !url)
      throw new Error('Enter a bookmark title and open a page to save.');
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error('This page has no valid URL to bookmark.');
    }
    if (!['http:', 'https:', 'file:', 'ftp:'].includes(parsed.protocol))
      throw new Error(
        'Open a website or file to bookmark. Browser settings and extension pages cannot be saved here.',
      );
    const folders = await this.getAllFolders();
    const destinations = [...new Set(folderIds)];
    if (!destinations.length) throw new Error('Choose at least one folder.');
    if (destinations.some((id) => !folders.some((folder) => folder.id === id)))
      throw new Error(
        'A selected folder is no longer available. Reopen TagChoose and choose an existing folder.',
      );
    const matches = await this.searchByUrl(url);
    const result = { updated: 0, created: 0 };
    // Add/update only. Unselected copies and duplicates are never deleted.
    for (const parentId of destinations) {
      const existing = matches.filter(
        (bookmark) => bookmark.parentId === parentId,
      );
      try {
        if (existing.length) {
          for (const bookmark of existing) {
            if (bookmark.unmodifiable)
              throw new Error('This bookmark is read-only');
            if (bookmark.title !== title)
              await chrome.bookmarks.update(bookmark.id, { title });
          }
          result.updated++;
        } else {
          await chrome.bookmarks.create({ parentId, title, url });
          result.created++;
        }
      } catch {
        throw new Error(
          `Saved in ${result.updated + result.created} location(s), but could not finish. Your existing bookmarks are safe. Reopen TagChoose to check the folders and retry.`,
        );
      }
    }
    return result;
  }

  async searchByUrl(url: string): Promise<Bookmark[]> {
    if (!url) throw new Error('A page URL is required.');
    return (await chrome.bookmarks.search({ url })).filter(
      (bookmark) => bookmark.url === url,
    );
  }

  async getSavedTabByUrl(url: string): Promise<SavedTab | null> {
    const matches = await this.searchByUrl(url);
    if (!matches.length) return null;
    const folders = await this.getAllFolders();
    const ids = new Set(matches.map((bookmark) => bookmark.parentId));
    return {
      bookmark: matches[0],
      folders: folders.filter((folder) => ids.has(folder.id)),
    };
  }
}
export const bookmarkService = new BookmarkService();
