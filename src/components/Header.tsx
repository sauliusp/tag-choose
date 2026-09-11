import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { URLs } from '../parameters';
export const Header = () => (
  <Box
    component="header"
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 3,
      py: 2,
      borderBottom: '1px solid #e6ddcc',
    }}
  >
    <Link
      href={URLs.website}
      target="_blank"
      rel="noreferrer"
      aria-label="TagChoose website"
    >
      <Typography
        component="span"
        sx={{
          fontWeight: 800,
          fontSize: 23,
          letterSpacing: -1,
          color: '#302b24',
        }}
      >
        #TagChoose.
      </Typography>
    </Link>
    <Typography variant="caption">BOOKMARKS, YOUR WAY</Typography>
  </Box>
);
