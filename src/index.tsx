import React from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './StoreContext';
import Popup from './Popup';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <StoreProvider>
    <Popup />
  </StoreProvider>,
);
