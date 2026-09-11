import { Folder } from '../types/Folder';
import { SavedTab } from '../types/SavedTab';
import { TabPreview } from '../types/TabPreview';
export interface State {
  loaded: boolean;
  aiComplete: boolean;
  folders: Folder[];
  title: string;
  url: string;
  selectedFolderIds: string[];
  suggestedFolderIds: string[];
  saved: boolean;
  selectionRevision: number;
}
export const INITIAL_STATE: State = {
  loaded: false,
  aiComplete: false,
  folders: [],
  title: '',
  url: '',
  selectedFolderIds: [],
  suggestedFolderIds: [],
  saved: false,
  selectionRevision: 0,
};
export type Action =
  | {
      type: 'initialize';
      folders: Folder[];
      tab: TabPreview;
      saved: SavedTab | null;
    }
  | { type: 'ai-start' }
  | { type: 'title'; value: string }
  | { type: 'select'; ids: string[] }
  | { type: 'suggest'; ids: string[]; revision: number };
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'initialize':
      return {
        ...INITIAL_STATE,
        loaded: true,
        folders: action.folders,
        title: action.saved?.bookmark.title || action.tab.title,
        url: action.tab.url,
        saved: !!action.saved,
        selectedFolderIds:
          action.saved?.folders
            .map((folder) => folder.id)
            .filter((id) =>
              action.folders.some((folder) => folder.id === id),
            ) ?? [],
      };
    case 'ai-start':
      return { ...state, aiComplete: false };
    case 'title':
      return { ...state, title: action.value };
    case 'select':
      return {
        ...state,
        selectedFolderIds: [...new Set(action.ids)].filter((id) =>
          state.folders.some((folder) => folder.id === id),
        ),
        selectionRevision: state.selectionRevision + 1,
      };
    case 'suggest': {
      const ids = [...new Set(action.ids)].filter((id) =>
        state.folders.some((folder) => folder.id === id),
      );
      return {
        ...state,
        aiComplete: true,
        suggestedFolderIds: ids,
        selectedFolderIds:
          action.revision === state.selectionRevision
            ? [...new Set([...state.selectedFolderIds, ...ids])]
            : state.selectedFolderIds,
      };
    }
  }
}
