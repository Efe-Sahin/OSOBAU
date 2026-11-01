import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router';

// Schriften werden lokal ausgeliefert (kein Google-Fonts-Request → DSGVO-freundlich)
import '@fontsource-variable/montserrat';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import './index.css';

import App from './App';
import { site } from './config/site';

// Farbwelt setzen (siehe site.ts → palette)
if (site.palette !== 'bronze') document.documentElement.dataset.palette = site.palette;

const Router = import.meta.env.VITE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
