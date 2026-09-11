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
  autoSelectedFolderIds: string[];
  saved: boolean;
  saving: boolean;
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
  autoSelectedFolderIds: [],
  saved: false,
  saving: false,
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
  | { type: 'save-start' }
  | { type: 'save-success' }
  | { type: 'save-end' }
  | { type: 'title'; value: string }
  | { type: 'select'; ids: string[] }
  | { type: 'suggest'; ids: string[]; revision: number; title: string };
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
      return {
        ...state,
        title: action.value,
        suggestedFolderIds: [],
        selectedFolderIds: state.selectedFolderIds.filter(
          (id) => !state.autoSelectedFolderIds.includes(id),
        ),
        autoSelectedFolderIds: [],
        aiComplete: false,
        selectionRevision: state.selectionRevision + 1,
      };
    case 'save-start':
      return {
        ...state,
        saving: true,
        autoSelectedFolderIds: [],
        selectionRevision: state.selectionRevision + 1,
      };
    case 'save-success':
      return { ...state, saved: true };
    case 'save-end':
      return { ...state, saving: false };
    case 'select':
      return {
        ...state,
        selectedFolderIds: [...new Set(action.ids)].filter((id) =>
          state.folders.some((folder) => folder.id === id),
        ),
        autoSelectedFolderIds: state.autoSelectedFolderIds.filter((id) =>
          action.ids.includes(id),
        ),
        selectionRevision: state.selectionRevision + 1,
      };
    case 'suggest': {
      if (action.title !== state.title) return state;
      const ids = [...new Set(action.ids)].filter((id) =>
        state.folders.some((folder) => folder.id === id),
      );
      const retainedIds = state.selectedFolderIds.filter(
        (id) => !state.autoSelectedFolderIds.includes(id),
      );
      return {
        ...state,
        aiComplete: true,
        suggestedFolderIds: ids,
        autoSelectedFolderIds:
          action.revision === state.selectionRevision
            ? ids.filter((id) => !retainedIds.includes(id))
            : state.autoSelectedFolderIds,
        selectedFolderIds:
          action.revision === state.selectionRevision
            ? [...new Set([...retainedIds, ...ids])]
            : state.selectedFolderIds,
      };
    }
  }
}
