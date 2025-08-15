import React, { useEffect, useState, useRef } from 'react';
import {
  TextField,
  Autocomplete,
  Chip,
  LinearProgress,
  Paper,
  Fab,
  Box,
  Popover,
  Typography,
  Link,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useStoreContext } from '../store/StoreContext';
import { bookmarkService } from '../services/bookmarkService';
import { aiService } from '../services/AiService';
import { ActionType } from '../store/Store';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import { Folder } from '../types/Folder';
import { PromptPayload } from '../types/PromptPayload';
import { URLs } from '../parameters';

const INITIAL_DOWNLOAD_POPOVER = {
  heading: 'Preparing Private AI...',
  body: 'For privacy, the on-device AI requires a one-time setup. Chrome will automatically download, install, and fine-tune the model (~4GB) in the background. This process can take a while to begin. Manual tagging is fully available. You can open "chrome://on-device-internals" in another tab for more details.',
  linkText: 'Read more about this one-time setup',
  linkUrl: URLs.aiInitialDownload,
  show: false,
};

export const TagSelect: React.FC = () => {
  const { state, computed, dispatch } = useStoreContext();
  const aiDownloadButtonRef = useRef<HTMLButtonElement>(null);

  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const aiButtonEnabled = computed.aiReady && !isLoading;

  const [downloadPopover, setDownloadPopover] = useState<{
    heading: string;
    body: string;
    linkText: string;
    linkUrl: string;
    show: boolean;
  }>(INITIAL_DOWNLOAD_POPOVER);

  const downloadProgressPercentage = state.aiProgress
    ? Math.round(state.aiProgress * 100)
    : 0;

  useEffect(() => {
    if (state.aiProgress === null) {
      return;
    }

    if (state.aiProgress < 1) {
      setDownloadPopover({
        ...downloadPopover,
        heading: `Downloading AI Model... ${downloadProgressPercentage}% complete`,
        body: 'The private AI model (~4GB) is downloading to your device. This one-time download ensures your data is never sent to the cloud. You can close this popover; the download will continue in the background.',
      });
    } else {
      setDownloadPopover({
        ...INITIAL_DOWNLOAD_POPOVER,
        heading: 'Download complete. Installing and fine-tuning...',
        show: true,
      });
    }
  }, [state.aiProgress]);

  useEffect(() => {
    const downloadFolders = async () => {
      try {
        const folders = await bookmarkService.getAllFolders();

        dispatch({ type: ActionType.SetFolders, payload: folders });
      } catch (error) {
        console.error(error);
      }
    };

    downloadFolders();
  }, []);

  const handlePrompt = async (promptPayload: PromptPayload) => {
    setError('');
    setIsLoading(true);

    try {
      const result = await aiService.runPrompt(promptPayload);

      dispatch({ type: ActionType.SetAiSuggestion, payload: result });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiDownload = async () => {
    setError('');
    setDownloadPopover({ ...downloadPopover, show: true });

    try {
      await aiService.getSession(handleDownloadProgress);

      dispatch({ type: ActionType.SetAiCapabilities, payload: 'available' });
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloadPopover(INITIAL_DOWNLOAD_POPOVER);
    }
  };

  const handleDownloadProgress = (progress: number) => {
    dispatch({ type: ActionType.UpdateAiProgress, payload: progress });
  };

  const handleTagDelete = (folderId: Folder['id']) => {
    dispatch({
      type: ActionType.SelectFolders,
      payload: state.selectedFolderIds.filter((id) => id !== folderId),
    });
  };

  const getTagIcon = (folderId: Folder['id']) =>
    state.suggestedFolderIds.includes(folderId) ? (
      <AutoAwesomeIcon color="primary" />
    ) : undefined;

  return (
    <div>
      <Autocomplete
        multiple
        disabled={isLoading}
        sx={{ mt: 2 }}
        options={state.allFolderIds}
        getOptionLabel={(folderId) => state.foldersById[folderId].title}
        getOptionKey={(folderId) => folderId}
        value={state.selectedFolderIds}
        onChange={(_, folderIds) =>
          dispatch({ type: ActionType.SelectFolders, payload: folderIds })
        }
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((id: string, index: number) => {
            // eslint-disable-next-line
            const { key, onDelete, ...tagProps } = getTagProps({ index });

            return (
              <Chip
                icon={getTagIcon(id)}
                variant="outlined"
                label={state.foldersById[id].title}
                key={id}
                onDelete={() => handleTagDelete(id)}
                {...tagProps}
                aria-label={`Tag: ${state.foldersById[id].title}`}
              />
            );
          })
        }
        renderInput={(params) => (
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                {...params}
                error={!!error}
                helperText={error}
                label="Bookmark Tags | 1 Tag = 1 Folder"
                placeholder="Bookmark Tags | 1 Tag = 1 Folder"
                aria-label="Bookmark Tags | 1 Tag = 1 Folder"
              />

              {isLoading && <LinearProgress aria-label="Loading" />}
            </Box>

            <Popover
              open={downloadPopover.show}
              anchorEl={aiDownloadButtonRef.current}
              onClose={() =>
                setDownloadPopover({ ...downloadPopover, show: false })
              }
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <Box sx={{ p: 2, maxWidth: 350 }}>
                <div>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                    >
                      {downloadPopover?.heading}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setDownloadPopover({ ...downloadPopover, show: false })
                      }
                      sx={{ p: 0.5, ml: 1 }}
                    >
                      <CloseIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {downloadPopover?.body}
                  </Typography>
                  <Link
                    href={downloadPopover?.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 1, display: 'block', fontSize: '0.875rem' }}
                  >
                    {downloadPopover?.linkText}
                  </Link>
                </div>
              </Box>
            </Popover>

            {!computed.aiDownloadable && (
              <Fab
                color="primary"
                aria-label="Suggest folders"
                size="small"
                disabled={!aiButtonEnabled}
                sx={{ flexShrink: 0, ml: '12px', mt: '9px' }}
                onClick={() => handlePrompt(computed.promptPayload)}
              >
                <AutoAwesomeIcon />
              </Fab>
            )}

            {computed.aiDownloadable && (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Fab
                  ref={aiDownloadButtonRef}
                  color="primary"
                  aria-label="Download AI Model"
                  size="small"
                  sx={{
                    flexShrink: 0,
                    ml: '12px',
                    mt: '9px',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.6 },
                      '100%': { opacity: 1 },
                    },
                  }}
                  onClick={handleAiDownload}
                >
                  <AutoAwesomeIcon />
                </Fab>
                <CircularProgress
                  size={56}
                  thickness={3}
                  sx={{
                    position: 'absolute',
                    top: '2px',
                    left: '4px',
                    color: 'primary.main',
                    opacity: 0.8,
                  }}
                  variant={'indeterminate'}
                />
              </Box>
            )}
          </Paper>
        )}
      />
    </div>
  );
};
