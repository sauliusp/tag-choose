import React from 'react';
import { Box, Toolbar, AppBar, Typography } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <AppBar color="transparent" position="static">
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          <Typography variant="body1" align="center">
            © {new Date().getFullYear()} Bookmark AI Tagger
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
