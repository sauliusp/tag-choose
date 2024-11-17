import React, { useEffect } from 'react';
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

        console.log(folders);

        dispatch({ type: ActionType.SetFolders, payload: folders });
      } catch (error) {
        console.error(error);
      }
    };

    initialize();
  }, []);

  return (
    <Autocomplete
      multiple
      sx={{ mt: 2 }}
      options={state.allFolderIds.map((id) => state.foldersById[id].title)}
      defaultValue={computed.selectedFoldersIds.map(
        (id) => state.foldersById[id].title,
      )}
      freeSolo
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip variant="outlined" label={option} key={key} {...tagProps} />
          );
        })
      }
      renderInput={(params) => (
        <TextField {...params} label="Tags" placeholder="Tags" />
      )}
    />
  );
};
