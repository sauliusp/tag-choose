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
            href="https://github.com/sauliusp/TagChoose/blob/main/PRODUCT_SPEC.md"
            target="_blank"
            color="inherit"
            underline="none"
          >
            About the Project
          </Link>
          <Link
            href="https://github.com/sauliusp/TagChoose/blob/main/README.md"
            target="_blank"
            color="inherit"
            underline="none"
          >
            Technical Details
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
