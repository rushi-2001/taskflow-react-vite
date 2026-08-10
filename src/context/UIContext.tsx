/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { uiReducer, initialState } from './uiReducer';
import type { UIState, SnackbarMessage } from './uiReducer';

export type { SnackbarMessage, UIState } from './uiReducer';

interface UIContextType {
  state: UIState;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  showNotification: (message: string, severity?: SnackbarMessage['severity']) => void;
  closeNotification: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const setSidebar = useCallback(
    (open: boolean) => dispatch({ type: 'SET_SIDEBAR', payload: open }),
    []
  );
  const showNotification = useCallback(
    (message: string, severity: SnackbarMessage['severity'] = 'info') => {
      dispatch({ type: 'ENQUEUE_SNACKBAR', payload: { message, severity } });
    },
    []
  );
  const closeNotification = useCallback(
    (id: string) => dispatch({ type: 'DEQUEUE_SNACKBAR', payload: id }),
    []
  );

  const contextValue = useMemo(
    () => ({
      state,
      toggleSidebar,
      setSidebar,
      showNotification,
      closeNotification,
    }),
    [state, toggleSidebar, setSidebar, showNotification, closeNotification]
  );

  return <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
