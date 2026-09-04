import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register PWA service worker with automatic updates
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] New version detected, auto updating...');
  },
  onOfflineReady() {
    console.log('[PWA] Bubble Math is ready for offline play');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
