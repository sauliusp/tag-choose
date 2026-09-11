import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UploadForm } from './components/UploadForm';
import { Container } from '@mui/material';
import { useStoreContext } from './store/StoreContext';

const Popup: React.FC = () => {
  const { state } = useStoreContext();
  return (
    <Container disableGutters>
      <Header disabled={state.saving} />

      <UploadForm />

      <Footer disabled={state.saving} />
    </Container>
  );
};

export default Popup;
