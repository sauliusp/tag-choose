import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
  useContext,
} from 'react';

import { reducer, INITIAL_STATE, Action, State, ComputedProps } from './store';

export interface StoreContextProps {
  state: State;
  computed: ComputedProps;
  dispatch: Dispatch<Action>;
}

const StoreContext = createContext<StoreContextProps>({} as StoreContextProps);

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const computed = {
    get selectedFoldersIds() {
      return Object.keys(state.selectedFolderIdsMap).filter(
        (folderId) => state.selectedFolderIdsMap[folderId],
      );
    },
    get selectedFolderTitles() {
      return this.selectedFoldersIds.map((id) => state.foldersById[id].title);
    },
    get savedTab() {
      return state.currentTab.savedTab;
    },
    get prompt() {
      return `Website URL: ${state.currentTab.preview.url}
      
      Website Title: ${state.currentTab.preview.title}
      
      I have these folders in my bookmarks bar: 
      
      ${Object.values(state.foldersById)
        .map((folder) => folder.title)
        .join(', ')}
        ----------------
        
        Please categorize this page into one or more folders. Give me only comma separated folder titles. For example: "Folder1, Folder2"`;
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
