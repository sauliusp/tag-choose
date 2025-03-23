import React from 'react';
import { Box, Toolbar, AppBar, Link } from '@mui/material';
import { URLs } from '../parameters';

const links = [
  {
    label: 'Suggest a Feature',
    href: URLs.suggestFeature,
  },
  {
    label: 'Write a Review',
    href: URLs.review,
  },
  {
    label: 'Buy me a Coffee',
    href: URLs.buyMeACoffee,
    highlight: true,
  },
];

export const Footer: React.FC = () => {
  return (
    <AppBar color="transparent" position="static" role="footer">
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexGrow: 1,
            alignItems: 'center',
          }}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              aria-label={link.label}
              sx={{ color: link.highlight ? 'primary.main' : 'text.secondary' }}
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
