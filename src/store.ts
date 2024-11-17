import { Folder } from './types/Folder';

export enum ActionType {
  Reset = 'Reset',
  SetUiState = 'SetUiState',
  SetFolders = 'SetFolders',
  SetFolderId = 'SetFolderId',
  ToggleFolderSelect = 'ToggleFolderSelect',
  CreateFolder = 'CreateFolder',
}

export type Action =
  | { type: ActionType.Reset }
  | { type: ActionType.SetUiState; payload: UiState }
  | { type: ActionType.SetFolders; payload: Folder[] }
  | { type: ActionType.ToggleFolderSelect; payload: Folder['id'] }
  | { type: ActionType.CreateFolder; payload: Folder };

export enum UiState {
  Upload = 'upload',
}

export interface State {
  uiState: UiState;
  foldersById: Record<Folder['id'], Folder>;
  selectedFolderIdsMap: Record<Folder['id'], boolean>;
  allFolderIds: Folder['id'][];
}

export interface ComputedProps {
  selectedFoldersIds: Folder['id'][];
}

export const INITIAL_STATE = {
  uiState: UiState.Upload,
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
    case ActionType.ToggleFolderSelect:
      return {
        ...state,
        selectedFolderIdsMap: {
          ...state.selectedFolderIdsMap,
          [action.payload]: !state.selectedFolderIdsMap[action.payload],
        },
      };
    case ActionType.CreateFolder:
      return {
        ...state,
      };
    default:
      throw new Error('Unknown action');
  }
}
