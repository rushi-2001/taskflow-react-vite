/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useMemo } from 'react';
import type { ReactNode } from 'react';

export interface SnackbarMessage {
  id: string;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

interface UIState {
  sidebarOpen: boolean;
  snackbars: SnackbarMessage[];
}

type UIAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'ENQUEUE_SNACKBAR'; payload: Omit<SnackbarMessage, 'id'> }
  | { type: 'DEQUEUE_SNACKBAR'; payload: string };

const initialState: UIState = {
  sidebarOpen: true,
  snackbars: [],
};

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    case 'ENQUEUE_SNACKBAR':
      return {
        ...state,
        snackbars: [
          ...state.snackbars,
          {
            ...action.payload,
            id: `sb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          },
        ],
      };
    case 'DEQUEUE_SNACKBAR':
      return {
        ...state,
        snackbars: state.snackbars.filter((sb) => sb.id !== action.payload),
      };
    default:
      return state;
  }
};

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

  const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' });
  const setSidebar = (open: boolean) => dispatch({ type: 'SET_SIDEBAR', payload: open });
  const showNotification = (message: string, severity: SnackbarMessage['severity'] = 'info') => {
    dispatch({ type: 'ENQUEUE_SNACKBAR', payload: { message, severity } });
  };
  const closeNotification = (id: string) => dispatch({ type: 'DEQUEUE_SNACKBAR', payload: id });

  const contextValue = useMemo(
    () => ({
      state,
      toggleSidebar,
      setSidebar,
      showNotification,
      closeNotification,
    }),
    [state]
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
