import React from 'react';
import { useStoreContext } from '../store/StoreContext';
import { Alert, Link } from '@mui/material';
import { URLs } from '../parameters';

export const AlertsContainer: React.FC = () => {
  const { state, computed } = useStoreContext();

  const showSavedTabAlert = computed.savedTab !== null;

  const showUnavailableAlert = state.aiCapabilities === 'unavailable';

  return (
    <>
      {showSavedTabAlert && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          role="alert"
          aria-live="polite"
        >
          This website is already bookmarked, but you can update its title or
          modify the associated folders.
        </Alert>
      )}
      {/* Renders when the model is not supported or unavailable on the device. */}
      {showUnavailableAlert && (
        <Alert
          severity="warning" // Changed to warning to be less alarming than error.
          sx={{ mb: 2 }}
          role="alert"
          aria-live="assertive"
        >
          AI features are not available on this browser or device. You can still
          tag this bookmark manually using autocomplete. For more info, visit
          the{' '}
          <Link
            href={URLs.technicalDetails}
            target="_blank"
            underline="none"
            rel="noopener noreferrer"
            aria-label="Technical Details Page"
          >
            Technical Details
          </Link>{' '}
          page.
        </Alert>
      )}
    </>
  );
};
