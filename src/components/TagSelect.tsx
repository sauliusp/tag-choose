import React, { useEffect, useState } from 'react';
import { TextField, Autocomplete, Chip } from '@mui/material';
import { useStoreContext } from '../StoreContext';
import { bookmarkService } from '../services/bookmarkService';
import { ActionType } from '../store';

export const TagSelect: React.FC = () => {
  const { state, computed, dispatch } = useStoreContext();

  useEffect(() => {
    const initialize = async () => {
      try {
        const folders = await bookmarkService.getAllFolders();

        dispatch({ type: ActionType.SetFolders, payload: folders });
      } catch (error) {
        console.error(error);
      }
    };

    initialize();
  }, []);

  const [value, setValue] = useState<string[]>(
    () => computed.selectedFoldersIds,
  );

  useEffect(() => {
    setValue(computed.selectedFoldersIds);
  }, [computed.selectedFoldersIds]);

  return (
    <Autocomplete
      multiple
      sx={{ mt: 2 }}
      options={state.allFolderIds}
      getOptionLabel={(folderId) => state.foldersById[folderId].title}
      getOptionKey={(folderId) => folderId}
      value={value}
      onChange={(_, folderIds) =>
        dispatch({ type: ActionType.ToggleFolderSelect, payload: folderIds })
      }
      freeSolo
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((id: string, index: number) => {
          // eslint-disable-next-line
          const { key, ...tagProps } = getTagProps({ index });

          return (
            <Chip
              variant="outlined"
              label={state.foldersById[id].title}
              key={id}
              {...tagProps}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField {...params} label="Tags" placeholder="Tags" />
      )}
    />
  );
};
