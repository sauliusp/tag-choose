import React, { useState, useEffect } from 'react';
import { useStoreContext } from './StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UploadForm } from './components/UploadForm';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';
import { Padding } from '@mui/icons-material';

const Popup: React.FC = () => {
  const { state } = useStoreContext();

  return (
    <Container disableGutters>
      <Header />

      <UploadForm />

      <Footer />
    </Container>
  );
};

export default Popup;
