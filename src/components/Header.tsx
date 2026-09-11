import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { URLs } from '../parameters';
export const Header = ({ disabled = false }: { disabled?: boolean }) => (
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
      href={disabled ? undefined : URLs.website}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
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
