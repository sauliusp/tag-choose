import React from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './store/StoreContext';
import { createTheme, ThemeProvider } from '@mui/material';
import Popup from './Popup';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './popup.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#faa916',
    },
    secondary: {
      main: '#160f29',
    },
    text: {
      primary: '#4D4D4D',
      secondary: '#160f29',
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <StoreProvider>
    <ThemeProvider theme={theme}>
      <Popup />
    </ThemeProvider>
  </StoreProvider>,
);
