export enum ActionType {
  Reset = 'Reset',
  SetUiState = 'SetUiState',
  SetTags = 'SetTags',
  SetTagId = 'SetTagId',
  ToggleTagSelect = 'ToggleTagSelect',
  CreateTag = 'CreateTag',
}

export type Action =
  | { type: ActionType.Reset }
  | { type: ActionType.SetUiState; payload: UiState }
  | { type: ActionType.SetTags; payload: Omit<Tag, 'selected'>[] }
  | { type: ActionType.SetTagId; payload: string | null }
  | { type: ActionType.ToggleTagSelect; payload: string }
  | { type: ActionType.CreateTag; payload: Tag };

export enum UiState {
  Upload = 'upload',
}

export interface Tag {
  id: string;
  name: string;
  selected: boolean;
}

export interface State {
  uiState: UiState;
  tagId: string | null;
  tagsById: Record<string, Tag>;
  allTagIds: string[];
}

export interface ComputedProps {
  selectedTagIds: string[];
}

export const INITIAL_STATE = {
  uiState: UiState.Upload,
  tagId: null,
  tagsById: {},
  allTagIds: [],
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.Reset:
      return INITIAL_STATE;
    case ActionType.SetUiState:
      return { ...state, uiState: action.payload };
    case ActionType.SetTags: {
      const tagsById = action.payload.reduce(
        (result, tag) => ({ ...result, [tag.id]: { ...tag, selected: false } }),
        {}
      );

      return { ...state, tagsById, allTagIds: Object.keys(tagsById) };
    }
    case ActionType.SetTagId:
      return { ...state, tagId: action.payload };
    case ActionType.ToggleTagSelect:
      return {
        ...state,
        tagsById: {
          ...state.tagsById,
          [action.payload]: {
            ...state.tagsById[action.payload],
            selected: !state.tagsById[action.payload].selected,
          },
        },
      };
    case ActionType.CreateTag:
      return {
        ...state,
        tagsById: {
          ...state.tagsById,
          [action.payload.id]: { ...action.payload, selected: false },
        },
        allTagIds: [...state.allTagIds, action.payload.id],
      };
    default:
      throw new Error('Unknown action');
  }
}
