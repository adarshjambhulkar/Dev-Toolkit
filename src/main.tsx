import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'sonner';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
        <Toaster position="top-right" richColors />
      </HashRouter>
    </Provider>
  </StrictMode>,
);
