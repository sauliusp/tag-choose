import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UploadForm } from './components/UploadForm';
import { Container } from '@mui/material';

const Popup: React.FC = () => {
  return (
    <Container disableGutters>
      <Header />

      <UploadForm />

      <Footer />
    </Container>
  );
};

export default Popup;
