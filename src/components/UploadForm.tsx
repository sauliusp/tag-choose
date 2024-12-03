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
} from '@mui/material';
import { TagSelect } from './TagSelect';
import { ActionType } from '../store/Store';
import { SavedTab } from '../types/SavedTab';
import { TabPreview } from '../types/TabPreview';
import { aiService } from '../services/AiService';
import { AlertContainer } from './AlertContainer';

export const UploadForm: React.FC = () => {
  const { state, computed, dispatch } = useStoreContext();

  const { currentTab } = state;

  useEffect(() => {
    const handleCurrentTab = async () => {
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

    const getAiCapabilities = async () => {
      const capabilities = await aiService.getAiCapabilities();

      dispatch({ type: ActionType.SetAiCapabilities, payload: capabilities });
    };

    handleCurrentTab();

    getAiCapabilities();
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
      <AlertContainer />

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
