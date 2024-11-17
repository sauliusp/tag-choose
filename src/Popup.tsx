import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UploadForm } from './components/UploadForm';
import { Container } from '@mui/material';
import { bookmarkService } from './services/bookmarkService';
import { tabPreviewService } from './services/TabPreviewService';

const Popup: React.FC = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        const tab = await tabPreviewService.getCurrentTabPreview();

        const { bookmark, folders } =
          await bookmarkService.searchBookmarksByUrl(tab.url);

        console.log({ tab, bookmark, folders });
      } catch (error) {
        console.error(error);
      }
    };

    initialize();
  }, []);

  return (
    <Container disableGutters>
      <Header />

      <UploadForm />

      <Footer />
    </Container>
  );
};

export default Popup;
