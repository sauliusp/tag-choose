import React from 'react';
import { Link, Box, Toolbar, AppBar } from '@mui/material';
import logo from '../../public/logo.svg';
import { URLs } from '../parameters';

const links = [
  {
    label: 'Technical Details',
    href: URLs.technicalDetails,
  },
  {
    label: 'About the Project',
    href: URLs.website,
  },
  {
    label: 'Privacy Policy',
    href: URLs.privacyPolicy,
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
              underline="none"
              aria-label={link.label}
              sx={{ color: 'text.secondary' }}
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
