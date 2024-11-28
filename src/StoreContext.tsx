import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
  useContext,
} from 'react';

import { reducer, INITIAL_STATE, Action, State, ComputedProps } from './store';
import { Folder } from './types/Folder';

export interface StoreContextProps {
  state: State;
  computed: ComputedProps;
  dispatch: Dispatch<Action>;
}

const StoreContext = createContext<StoreContextProps>({} as StoreContextProps);

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const computed: ComputedProps = {
    get selectedFolderIds(): Folder['id'][] {
      return [...state.suggestedFolderIds, ...state.selectedFolderIds];
    },
    get folderTitleString(): string {
      return Object.keys(state.foldersByTitle).join(', ');
    },
    get savedTab(): typeof state.currentTab.savedTab {
      return state.currentTab.savedTab;
    },
    get prompt(): string {
      return `<url>${state.currentTab.preview.url}</url>
  <title>${state.currentTab.preview.title}</title>
  <folders>${this.folderTitleString}</folders>
  <instruction>Select appropriate bookmark folders from the provided folder list. Provide only comma-separated folder titles. Example: "FolderTitle1, FolderTitle2"</instruction>`;
    },
  };

  return (
    <StoreContext.Provider value={{ state, computed, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

const useStoreContext = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }

  return context;
};

export { StoreProvider, useStoreContext };
