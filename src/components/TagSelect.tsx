import React, { useEffect, useState } from 'react';
import { TextField, Autocomplete, Chip } from '@mui/material';
import { useStoreContext } from '../StoreContext';
import { bookmarkService } from '../services/bookmarkService';
import { aiService } from '../services/AiService';
import { ActionType } from '../store';
import { AiModelDefaults } from '../types/AiModelDefaults';

export const TagSelect: React.FC = () => {
  const { state, computed, dispatch } = useStoreContext();

  const [aiError, setAiError] = useState('');

  const [aiDefaults, setAiDefaults] = useState<AiModelDefaults | null>(null);

  useEffect(() => {
    const downloadFolders = async () => {
      try {
        const folders = await bookmarkService.getAllFolders();

        dispatch({ type: ActionType.SetFolders, payload: folders });
      } catch (error) {
        console.error(error);
      }
    };

    const initAi = async () => {
      try {
        const defaults = await aiService.initDefaults();

        setAiDefaults(defaults);
      } catch (err) {
        setAiError(err.message);
      }
    };

    downloadFolders();

    initAi();
  }, []);

  const handlePrompt = async (prompt: string) => {
    setAiError('');

    try {
      if (!aiDefaults) throw new Error('Defaults not loaded');

      const params = {
        temperature: aiDefaults.defaultTemperature,
        topK: aiDefaults.defaultTopK,
      };
      const result = await aiService.runPrompt(prompt, params);

      dispatch({ type: ActionType.SetAiSuggestion, payload: result });
    } catch (err) {
      setAiError(err.message);
    }
  };

  return (
    <div>
      <Autocomplete
        multiple
        sx={{ mt: 2 }}
        options={state.allFolderIds}
        getOptionLabel={(folderId) => state.foldersById[folderId].title}
        getOptionKey={(folderId) => folderId}
        value={computed.selectedFolderIds}
        onChange={(_, folderIds) =>
          dispatch({ type: ActionType.SelectFolders, payload: folderIds })
        }
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((id: string, index: number) => {
            // eslint-disable-next-line
            const { key, onDelete, ...tagProps } = getTagProps({ index });

            return (
              <Chip
                variant="outlined"
                label={state.foldersById[id].title}
                key={id}
                onDelete={() => {
                  dispatch({
                    type: ActionType.SelectFolders,
                    payload: computed.selectedFolderIds.filter(
                      (folderId) => folderId !== id,
                    ),
                  });
                }}
                {...tagProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField {...params} label="Tags" placeholder="Tags" />
        )}
      />

      <div>
        {aiError && <p>Error: {aiError}</p>}
        {state.aiResponse && <p>Response: {state.aiResponse}</p>}
        <br />
        <br />
        {computed.prompt && <p>{computed.prompt}</p>}

        <button onClick={() => handlePrompt(computed.prompt)}>
          Run Prompt
        </button>
      </div>
    </div>
  );
};
