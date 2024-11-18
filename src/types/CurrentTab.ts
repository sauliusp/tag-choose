import { Folder } from './Folder';
import { SavedTab } from './SavedTab';
import { TabPreview } from './TabPreview';

export interface CurrentTab {
  title: string;
  folders: Folder[];
  preview: TabPreview;
  savedTab: SavedTab | null;
}
