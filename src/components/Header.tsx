import React from 'react';
import { Link, Box, Toolbar, AppBar } from '@mui/material';

export const Header: React.FC = () => {
  return (
    <AppBar color="transparent" position="static">
      <Toolbar>
        <Box
          sx={{ display: 'flex', gap: 2, justifyContent: 'end', flexGrow: 1 }}
        >
          <Link
            href="https://example.com/link2"
            target="_blank"
            color="inherit"
            underline="none"
          >
            About the Project
          </Link>
          <Link
            href="https://example.com/link3"
            target="_blank"
            color="inherit"
            underline="none"
          >
            Give Feedback
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
