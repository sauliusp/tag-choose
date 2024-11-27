import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UploadForm } from './components/UploadForm';
import { Container } from '@mui/material';
import AiComponent from './components/AiComponent';

const Popup: React.FC = () => {
  return (
    <Container disableGutters>
      <Header />

      <UploadForm />

      <AiComponent />

      <Footer />
    </Container>
  );
};

export default Popup;
