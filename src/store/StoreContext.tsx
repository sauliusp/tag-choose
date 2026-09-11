import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
  useContext,
} from 'react';
import { reducer, INITIAL_STATE, Action, State } from './Store';
const StoreContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | null>(null);
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('StoreProvider is required.');
  return context;
};
