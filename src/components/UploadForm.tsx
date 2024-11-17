import React, { useState } from 'react';
import { bookmarkService } from '../services/BookmarkService';
import {
  TextField,
  Button,
  Container,
  Typography,
  InputAdornment,
  Chip,
} from '@mui/material';
import { TagSelect } from './TagSelect';

export const UploadForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const tags = ['Tag1', 'Tag2', 'Tag3'];

  const handleUpload = () => {
    // Handle the upload logic here
    console.log('Title:', title);
    console.log('Tag:', tag);
  };

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Upload Bookmark
      </Typography>

      <TextField
        label="Bookmark Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <img
                  src="https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg"
                  alt="icon"
                  style={{ width: 24, height: 24 }}
                />
              </InputAdornment>
            ),
          },
        }}
      />

      <TagSelect />

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleUpload}
        fullWidth
        sx={{ mt: 3 }}
      >
        Upload Bookmark
      </Button>
    </Container>
  );
};
