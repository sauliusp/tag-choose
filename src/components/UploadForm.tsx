import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { tabPreviewService } from '../services/TabPreviewService';
import { bookmarkService } from '../services/BookmarkService';
import { useStoreContext } from '../store/StoreContext';
import { TagSelect } from './TagSelect';
export const UploadForm = () => {
  const { state, dispatch } = useStoreContext();
  const [error, setError] = useState('');
  const saving = state.saving;
  const [success, setSuccess] = useState('');
  const inFlight = useRef(false);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [tab, folders] = await Promise.all([
          tabPreviewService.getCurrentTabPreview(),
          bookmarkService.getAllFolders(),
        ]);
        const saved = await bookmarkService.getSavedTabByUrl(tab.url);
        if (active) dispatch({ type: 'initialize', tab, folders, saved });
      } catch (e) {
        if (active)
          setError(
            e instanceof Error
              ? e.message
              : 'Could not load bookmarks. Reopen TagChoose to retry.',
          );
      }
    })();
    return () => {
      active = false;
    };
  }, [dispatch]);
  useEffect(() => {
    setSuccess('');
  }, [state.selectedFolderIds, state.title]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inFlight.current || !state.loaded) return;
    inFlight.current = true;
    dispatch({ type: 'save-start' });
    setError('');
    setSuccess('');
    try {
      const result = await bookmarkService.upsertBookmarkInMultipleFolders(
        state.selectedFolderIds,
        state.title,
        state.url,
      );
      dispatch({ type: 'save-success' });
      setSuccess(
        `Saved in ${result.created + result.updated} folder${result.created + result.updated === 1 ? '' : 's'}. Existing copies are kept.`,
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Could not save. Please try again.',
      );
    } finally {
      inFlight.current = false;
      dispatch({ type: 'save-end' });
    }
  };
  return (
    <Container component="form" onSubmit={save} sx={{ py: 2.5 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {!state.loaded && !error && (
        <Typography role="status">Loading your page and folders…</Typography>
      )}
      {state.loaded && (
        <>
          <Typography variant="h6" component="h1">
            One page. All the right folders.
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, mb: 2 }}>
            AI suggests folders. Review its choices, or choose manually.
          </Typography>
          {state.saved && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Already bookmarked. Saving updates selected locations and keeps
              every other copy.
            </Alert>
          )}
          <TextField
            label="Bookmark title"
            value={state.title}
            onChange={(e) => {
              setSuccess('');
              dispatch({ type: 'title', value: e.target.value });
            }}
            fullWidth
            disabled={saving}
            required
            inputProps={{ maxLength: 2000 }}
          />
          <Typography
            variant="caption"
            component="p"
            sx={{ mt: 0.75, overflowWrap: 'anywhere', color: 'text.secondary' }}
          >
            {state.url}
          </Typography>
          <TagSelect disabled={saving} />
          {!state.folders.length && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Create a bookmark folder in Chrome, then reopen TagChoose.
            </Alert>
          )}
          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={
                saving || !state.title.trim() || !state.selectedFolderIds.length
              }
            >
              {saving
                ? 'Saving…'
                : state.saved
                  ? 'Save changes'
                  : 'Save bookmark'}
            </Button>
          </Box>
          <Typography variant="caption" component="p" sx={{ mt: 1 }}>
            Each selected folder gets a copy. Unselected bookmarks stay where
            they are.
          </Typography>
        </>
      )}
    </Container>
  );
};
