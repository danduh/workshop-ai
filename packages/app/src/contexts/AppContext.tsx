import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the global state shape
export interface AppState {
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
  };
  ui: {
    sidebarOpen: boolean;
    loading: boolean;
    theme: 'light' | 'dark';
  };
  errors: {
    global: string | null;
  };
}

// Define action types
export type AppAction =
  | { type: 'SET_USER'; payload: { id: string; name: string; email: string } }
  | { type: 'CLEAR_USER' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_GLOBAL_ERROR'; payload: string | null };

// Get theme from localStorage or default to 'light'
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  }
  return 'light';
};

// Initial state
const initialState: AppState = {
  user: {
    id: null,
    name: null,
    email: null,
  },
  ui: {
    sidebarOpen: false,
    loading: false,
    theme: getInitialTheme(),
  },
  errors: {
    global: null,
  },
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: {
          id: null,
          name: null,
          email: null,
        },
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };
    case 'SET_SIDEBAR_OPEN':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: action.payload,
        },
      };
    case 'SET_LOADING':
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload,
        },
      };
    case 'SET_THEME':
      // Persist theme to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload,
        },
      };
    case 'SET_GLOBAL_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          global: action.payload,
        },
      };
    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Convenience hooks for specific parts of the state
export const useUser = () => {
  const { state, dispatch } = useAppContext();
  
  const setUser = (user: { id: string; name: string; email: string }) => {
    dispatch({ type: 'SET_USER', payload: user });
  };
  
  const clearUser = () => {
    dispatch({ type: 'CLEAR_USER' });
  };
  
  return {
    user: state.user,
    setUser,
    clearUser,
    isLoggedIn: !!state.user.id,
  };
};

export const useUI = () => {
  const { state, dispatch } = useAppContext();
  
  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };
  
  const setSidebarOpen = (open: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
  };
  
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };
  
  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };
  
  const toggleTheme = () => {
    const newTheme = state.ui.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  return {
    sidebarOpen: state.ui.sidebarOpen,
    loading: state.ui.loading,
    theme: state.ui.theme,
    toggleSidebar,
    setSidebarOpen,
    setLoading,
    setTheme,
    toggleTheme,
  };
};
