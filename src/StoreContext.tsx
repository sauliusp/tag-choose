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
