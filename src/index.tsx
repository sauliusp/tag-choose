import React from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './StoreContext';
import Popup from './Popup';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './popup.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <StoreProvider>
    <Popup />
  </StoreProvider>,
);
