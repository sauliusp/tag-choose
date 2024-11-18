import { Bookmark } from './Bookmark';
import { Folder } from './Folder';

export interface SavedTab {
  bookmark: Bookmark;
  folders: Folder[];
}
