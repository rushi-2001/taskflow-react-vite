import { generateId } from '@/utils/idUtils';

export interface SnackbarMessage {
  id: string;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

export interface UIState {
  sidebarOpen: boolean;
  snackbars: SnackbarMessage[];
}

export type UIAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'ENQUEUE_SNACKBAR'; payload: Omit<SnackbarMessage, 'id'> }
  | { type: 'DEQUEUE_SNACKBAR'; payload: string };

export const initialState: UIState = {
  sidebarOpen: true,
  snackbars: [],
};

export const uiReducer = (state: UIState, action: UIAction): UIState => {
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
            id: generateId('sb'),
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
