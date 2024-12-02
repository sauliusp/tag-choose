import React, { useEffect } from 'react';
import { tabPreviewService } from '../services/TabPreviewService';
import { bookmarkService } from '../services/bookmarkService';
import { useStoreContext } from '../store/StoreContext';

import {
  TextField,
  Button,
  Container,
  Typography,
  InputAdornment,
  Alert,
} from '@mui/material';
import { TagSelect } from './TagSelect';
import { ActionType } from '../store/Store';
import { SavedTab } from '../types/SavedTab';
import { TabPreview } from '../types/TabPreview';

export const UploadForm: React.FC = () => {
  const { state, computed, dispatch } = useStoreContext();

  const { currentTab } = state;

  useEffect(() => {
    const initialize = async () => {
      try {
        const tabPreview: TabPreview =
          await tabPreviewService.getCurrentTabPreview();

        const savedTab: SavedTab | null =
          await bookmarkService.getSavedTabByUrl(tabPreview.url);

        dispatch({
          type: ActionType.SetCurrentTab,
          payload: { tabPreview, savedTab },
        });

        if (savedTab) {
          dispatch({
            type: ActionType.SelectFolders,
            payload: savedTab.folders.map((folder) => folder.id),
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    initialize();
  }, []);

  const handleSubmit = async () => {
    try {
      await bookmarkService.upsertBookmarkInMultipleFolders(
        state.selectedFolderIds,
        currentTab.title,
        currentTab.preview.url,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const isTabSaved = computed.savedTab !== null;

  const actionText = `${isTabSaved ? 'Update' : 'Save'} Bookmark`;

  return (
    <Container sx={{ py: 3 }}>
      {isTabSaved && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This page is already bookmarked. You can modify its title or update
          the associated folders.
        </Alert>
      )}

      <Alert severity="warning" sx={{ mb: 2 }}>
        Your browser supports AI features, but they’re currently unavailable,
        possibly due to limited disk space. You can still tag this bookmark
        using autocomplete.
      </Alert>

      <Typography variant="subtitle1" gutterBottom>
        {actionText}
      </Typography>

      {currentTab && (
        <TextField
          label="Bookmark Title"
          value={currentTab.title}
          onChange={(e) =>
            dispatch({
              type: ActionType.UpdateTabTitle,
              payload: e.target.value,
            })
          }
          fullWidth
          margin="normal"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <img
                    src={currentTab.preview.faviconUrl}
                    alt="icon"
                    style={{ width: 24, height: 24 }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      )}

      <TagSelect />

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubmit}
        fullWidth
        sx={{ mt: 3 }}
      >
        {actionText}
      </Button>
    </Container>
  );
};
