import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  LinearProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useStoreContext } from '../store/StoreContext';
import { AiFlow, initialAiState } from '../services/AiFlow';
import { AiService } from '../services/AiService';
import { URLs } from '../parameters';
export const TagSelect = ({ disabled = false }: { disabled?: boolean }) => {
  const { state, dispatch } = useStoreContext();
  const [status, setStatus] = useState(initialAiState);
  const flow = useRef<AiFlow | null>(null);
  const latest = useRef(state);
  latest.current = state;
  const initialRequest = useRef(false);
  useEffect(() => {
    const current = new AiFlow(new AiService());
    flow.current = current;
    const unsub = current.subscribe(setStatus);
    void current.check();
    return () => {
      unsub();
      current.dispose();
    };
  }, []);
  const suggest = () => {
    const snapshot = latest.current;
    dispatch({ type: 'ai-start' });
    void flow.current
      ?.run({
        title: snapshot.title,
        url: snapshot.url,
        folders: snapshot.folders,
      })
      .then(() => {
        if (flow.current?.state.phase === 'complete')
          dispatch({
            type: 'suggest',
            ids: flow.current.state.ids,
            revision: snapshot.selectionRevision,
            title: snapshot.title,
          });
      });
  };
  useEffect(() => {
    if (
      status.phase === 'ready' &&
      !initialRequest.current &&
      state.folders.length
    ) {
      initialRequest.current = true;
      suggest();
    }
  }, [status.phase, state.folders.length]);
  const folderLabel = (id: string) => {
    const folder = state.folders.find((candidate) => candidate.id === id);
    const path = folder?.path ?? folder?.title ?? id;
    const duplicates = state.folders.filter(
      (candidate) => (candidate.path ?? candidate.title) === path,
    );
    return duplicates.length > 1
      ? `${path} (duplicate ${duplicates.findIndex((candidate) => candidate.id === id) + 1} of ${duplicates.length})`
      : path;
  };
  const additionalSuggestions = state.suggestedFolderIds.filter(
    (id) => !state.selectedFolderIds.includes(id),
  );
  const busy =
    ['checking', 'waiting', 'preparing', 'suggesting'].includes(status.phase) ||
    (status.phase === 'downloading' && status.progress !== null);
  const setup =
    ['downloadable', 'downloading', 'unavailable'].includes(status.phase) &&
    !busy;
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 2, p: 1.5, border: '1px solid #d8c7a6', borderRadius: 2 }}>
        <Typography variant="subtitle2">
          Private AI folder suggestions
        </Typography>
        <Box role="status" aria-live="polite">
          <Typography variant="body2" sx={{ my: 1 }}>
            {status.phase === 'checking'
              ? 'Checking whether Chrome can run local AI…'
              : status.phase === 'unavailable'
                ? 'Chrome’s local AI is unavailable here. Automatic suggestions need a supported device and a ready model. You can choose folders manually and save.'
                : status.phase === 'downloadable'
                  ? 'To get automatic suggestions, Chrome needs to download and prepare its on-device model. Open setup for requirements and progress, or choose folders manually.'
                  : status.phase === 'downloading' && status.progress === null
                    ? 'Chrome reports a model download in progress. Open setup to follow it.'
                    : status.phase === 'waiting'
                      ? 'Waiting for Chrome to start the model…'
                      : status.phase === 'downloading'
                        ? `Downloading the model: ${Math.round((status.progress ?? 0) * 100)}%`
                        : status.phase === 'preparing'
                          ? 'Chrome is preparing the local model. Wait for suggestions, or choose folders manually.'
                          : status.phase === 'suggesting'
                            ? 'AI is choosing folders for this page…'
                            : status.phase === 'complete' && !state.aiComplete
                              ? 'The title changed. Choose Suggest again for updated AI suggestions, or select folders manually.'
                            : status.message || 'Local AI is ready.'}
          </Typography>
          {busy && (
            <LinearProgress
              aria-label="Local AI progress"
              variant={
                status.phase === 'downloading' ? 'determinate' : 'indeterminate'
              }
              value={(status.progress ?? 0) * 100}
            />
          )}
          {status.stalled && (
            <Alert severity="info" sx={{ mt: 1 }}>
              Chrome has not reported new progress for 20 seconds. You can stop
              waiting and retry. This does not confirm a failed download.
            </Alert>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          {setup && (
            <Button
              size="small"
              variant="contained"
              onClick={() =>
                void chrome.tabs.create({
                  url: chrome.runtime.getURL('setup.html'),
                })
              }
            >
              Open AI setup
            </Button>
          )}
          {!setup && !busy && (
            <Button
              size="small"
              variant="outlined"
              disabled={disabled || !state.folders.length}
              onClick={suggest}
            >
              {status.phase === 'complete' ? 'Suggest again' : 'Retry AI'}
            </Button>
          )}
          {busy && status.phase !== 'checking' && (
            <Button size="small" onClick={() => flow.current?.cancel()}>
              Stop waiting
            </Button>
          )}
          <Link
            href={URLs.aiNotAvailable}
            target="_blank"
            rel="noreferrer"
            sx={{ fontSize: 12, alignSelf: 'center' }}
          >
            Requirements & help
          </Link>
        </Box>
        <Typography variant="caption" component="p" sx={{ mt: 1 }}>
          Automatic suggestions use Chrome’s local AI only. Manual selection
          works during setup or if AI is unavailable.
        </Typography>
      </Box>
      {status.phase === 'complete' && additionalSuggestions.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            AI also suggested these folders. Add any that fit:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {additionalSuggestions.map((id) => (
              <Chip
                key={id}
                label={`+ ${folderLabel(id)}`}
                disabled={disabled}
                onClick={() =>
                  dispatch({
                    type: 'select',
                    ids: [...state.selectedFolderIds, id],
                  })
                }
              />
            ))}
          </Box>
        </Box>
      )}
      <Autocomplete
        multiple
        disabled={disabled}
        options={state.folders.map((folder) => folder.id)}
        value={state.selectedFolderIds}
        getOptionKey={(id) => id}
        getOptionLabel={folderLabel}
        onChange={(_, ids) => dispatch({ type: 'select', ids })}
        renderTags={(ids, getTagProps) =>
          ids.map((id, index) => {
            const { key, ...props } = getTagProps({ index });
            return (
              <Chip {...props} key={key} label={folderLabel(id)} size="small" />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Review bookmark folders"
            placeholder="Search your bookmark folders"
            helperText={
              state.aiComplete
                ? 'Keep or change the AI choices. Full paths distinguish matching names.'
                : 'Choose folders manually now, or wait for AI suggestions.'
            }
          />
        )}
      />
    </Box>
  );
};
