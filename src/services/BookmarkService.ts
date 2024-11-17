import { Folder } from '../types/Folder';
import { Bookmark } from '../types/Bookmark';

class BookmarkService {
  private static instance: BookmarkService;

  private constructor() {}

  public static getInstance(): BookmarkService {
    if (!BookmarkService.instance) {
      BookmarkService.instance = new BookmarkService();
    }
    return BookmarkService.instance;
  }

  async getAllFolders(): Promise<Folder[]> {
    const flattenFolders = (nodes: Folder[]): Folder[] => {
      const folders: Folder[] = [];
      for (const node of nodes) {
        if (node.children) {
          folders.push(node);
          folders.push(...flattenFolders(node.children));
        }
      }
      return folders;
    };

    const bookmarkTree = await chrome.bookmarks.getTree();
    return flattenFolders(bookmarkTree);
  }

  async createBookmark(
    folderId: string,
    title: string,
    url: string,
  ): Promise<Bookmark> {
    if (!folderId || !title || !url) {
      throw new Error(
        'Folder ID, title, and URL are required to create a bookmark.',
      );
    }

    const bookmark = await chrome.bookmarks.create({
      parentId: folderId,
      title,
      url,
    });

    return bookmark;
  }

  async createBookmarkInMultipleFolders(
    folderIds: string[],
    title: string,
    url: string,
  ): Promise<Bookmark[]> {
    if (!folderIds || folderIds.length === 0 || !title || !url) {
      throw new Error(
        'Folder IDs, title, and URL are required to create bookmarks.',
      );
    }

    const createdBookmarks: Bookmark[] = [];

    for (const folderId of folderIds) {
      const bookmark = await chrome.bookmarks.create({
        parentId: folderId,
        title,
        url,
      });
      createdBookmarks.push(bookmark);
    }

    return createdBookmarks;
  }

  async searchBookmarksByUrl(
    url: string,
  ): Promise<{ bookmark: Bookmark | null; folders: Folder[] }> {
    if (!url) {
      throw new Error('URL is required to search bookmarks.');
    }

    const matchingBookmarks = await chrome.bookmarks.search({ url });

    if (matchingBookmarks.length === 0) {
      return { bookmark: null, folders: [] };
    }

    const bookmark = matchingBookmarks[0];
    const folderIds = new Set<string>();

    for (const match of matchingBookmarks) {
      if (match.parentId) {
        folderIds.add(match.parentId);
      }
    }

    const folderPromises = Array.from(folderIds).map((folderId) =>
      chrome.bookmarks.get(folderId).then((folders) => folders[0]),
    );

    const folders = await Promise.all(folderPromises);

    return { bookmark, folders };
  }
}

export const bookmarkService = BookmarkService.getInstance();
