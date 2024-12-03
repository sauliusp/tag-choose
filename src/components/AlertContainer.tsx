import React from 'react';
import { useStoreContext } from '../store/StoreContext';

import { Alert } from '@mui/material';

export const AlertContainer: React.FC = () => {
  const { computed, state } = useStoreContext();

  const showSavedTabAlert = computed.savedTab !== null;
  const showAiWarning =
    state.aiCapabilities !== null &&
    state.aiCapabilities !== 'unsupported' &&
    state.aiCapabilities.available === 'no';
  const showAiError = state.aiCapabilities === 'unsupported';

  return (
    <>
      {showSavedTabAlert && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This page is already bookma rked. You can modify its title or update
          the associated folders.
        </Alert>
      )}

      {showAiWarning && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your browser supports AI features, but they’re currently unavailable,
          possibly due to limited disk space. You can still tag this bookmark
          using autocomplete.
        </Alert>
      )}

      {showAiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Your browser does not support AI featrues, but you can still tag this
          bookmark using autocomplete.
        </Alert>
      )}
    </>
  );
};
