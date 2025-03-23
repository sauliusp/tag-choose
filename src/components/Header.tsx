import React from 'react';
import { Link, Box, Toolbar, AppBar } from '@mui/material';
import logo from '../../public/logo.svg';

export const Header: React.FC = () => {
  return (
    <AppBar color="transparent" position="static" role="header">
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'end',
            flexGrow: 1,
            alignItems: 'center',
          }}
        >
          <Link
            sx={{ mr: 'auto' }}
            href="https://tagchoose.site"
            target="_blank"
            underline="none"
            aria-label="TagChoose Website"
          >
            <img
              src={logo}
              width={150}
              title="TagChoose Logo"
              alt="TagChoose Logo"
            />
          </Link>

          <Link
            href="https://github.com/sauliusp/TagChoose/blob/main/PRODUCT_SPEC.md"
            target="_blank"
            underline="none"
            aria-label="About the Project"
            sx={{ color: 'text.secondary' }}
          >
            About the Project
          </Link>
          <Link
            href="https://github.com/sauliusp/TagChoose/blob/main/README.md"
            target="_blank"
            underline="none"
            aria-label="Technical Details"
            sx={{ color: 'text.secondary' }}
          >
            Technical Details
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
