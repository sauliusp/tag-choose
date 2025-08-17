import React from 'react';
import { Link, Box, Toolbar, AppBar } from '@mui/material';
import logo from '../../public/logo.svg';
import { URLs } from '../parameters';
import { PromoLink } from '../types/PromoLink';

const links: PromoLink[] = [
  {
    label: 'AI Download Taking Long?',
    href: URLs.aiInitialDownload,
  },
  {
    label: 'AI Features Not Available?',
    href: URLs.aiNotAvailable,
  },
  {
    label: 'Visit Website',
    href: URLs.about,
  },
];

export const Header: React.FC = () => {
  return (
    <AppBar color="transparent" position="static" role="header">
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
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

          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              color="text.secondary"
              underline="hover"
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
