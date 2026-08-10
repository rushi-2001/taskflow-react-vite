import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import './index.css';
import App from './App.tsx';

const initApp = async () => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    const { bootstrapMockApi } = await import('@/api/mock/mockAdapter');
    bootstrapMockApi();
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
};

initApp();
