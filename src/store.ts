import { CurrentTab } from './types/CurrentTab';
import { Folder } from './types/Folder';
import { SavedTab } from './types/SavedTab';
import { TabPreview } from './types/TabPreview';

export enum ActionType {
  Reset = 'Reset',
  SetUiState = 'SetUiState',
  SetCurrentTab = 'SetCurrentTab',
  UpdateTabTitle = 'UpdateTabTitle',
  SetFolders = 'SetFolders',
  SetFolderId = 'SetFolderId',
  SelectFolders = 'SelectFolders',
  CreateFolder = 'CreateFolder',
}

export type Action =
  | { type: ActionType.Reset }
  | { type: ActionType.SetUiState; payload: UiState }
  | {
      type: ActionType.SetCurrentTab;
      payload: { tabPreview: TabPreview; savedTab: SavedTab | null };
    }
  | { type: ActionType.UpdateTabTitle; payload: string }
  | { type: ActionType.SetFolders; payload: Folder[] }
  | { type: ActionType.SelectFolders; payload: Folder['id'][] }
  | { type: ActionType.CreateFolder; payload: Folder };

export enum UiState {
  Upload = 'upload',
}

export interface State {
  uiState: UiState;
  currentTab: CurrentTab;
  foldersById: Record<Folder['id'], Folder>;
  selectedFolderIdsMap: Record<Folder['id'], boolean>;
  allFolderIds: Folder['id'][];
}

export interface ComputedProps {
  selectedFoldersIds: Folder['id'][];
  selectedFolderTitles: Folder['title'][];
  savedTab: SavedTab | null;
}

export const INITIAL_STATE = {
  uiState: UiState.Upload,
  currentTab: {
    title: '',
    folders: [],
    preview: {
      title: '',
      url: '',
      faviconUrl: '',
    },
    savedTab: null,
  },
  foldersById: {},
  selectedFolderIdsMap: {},
  allFolderIds: [],
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.Reset:
      return INITIAL_STATE;
    case ActionType.SetUiState:
      return { ...state, uiState: action.payload };
    case ActionType.SetCurrentTab: {
      const { savedTab, tabPreview } = action.payload;

      return {
        ...state,
        currentTab: {
          title: savedTab ? savedTab.bookmark.title : tabPreview.title,
          folders: savedTab ? savedTab.folders : [],
          preview: tabPreview,
          savedTab,
        },
      };
    }
    case ActionType.UpdateTabTitle:
      return {
        ...state,
        currentTab: { ...state.currentTab, title: action.payload },
      };
    case ActionType.SetFolders: {
      const { foldersById, selectedFolderIdsMap, allFolderIds } =
        action.payload.reduce(
          (result, folder) => ({
            ...result,
            foldersById: { ...result.foldersById, [folder.id]: folder },
            selectedFolderIdsMap: {
              ...result.selectedFolderIdsMap,
              [folder.id]: false,
            },
            allFolderIds: [...result.allFolderIds, folder.id],
          }),
          { foldersById: {}, selectedFolderIdsMap: {}, allFolderIds: [] } as {
            foldersById: State['foldersById'];
            selectedFolderIdsMap: State['selectedFolderIdsMap'];
            allFolderIds: State['allFolderIds'];
          },
        );

      return {
        ...state,
        foldersById,
        selectedFolderIdsMap,
        allFolderIds,
      };
    }
    case ActionType.SelectFolders:
      state.currentTab.folders = [];

      Object.keys(state.selectedFolderIdsMap).forEach((folderId) => {
        state.selectedFolderIdsMap[folderId] =
          action.payload.includes(folderId);

        if (state.selectedFolderIdsMap[folderId]) {
          state.currentTab.folders.push(state.foldersById[folderId]);
        }
      });

      return state;
    case ActionType.CreateFolder:
      return {
        ...state,
      };
    default:
      throw new Error('Unknown action');
  }
}
