import React from 'react';
import { Box, Link } from '@mui/material';
import { URLs } from '../parameters';
export const Footer = ({ disabled = false }: { disabled?: boolean }) => (
  <Box
    component="footer"
    sx={{
      display: 'flex',
      gap: 2,
      justifyContent: 'center',
      px: 2,
      py: 1.5,
      borderTop: '1px solid #e6ddcc',
      fontSize: 12,
    }}
  >
    {[
      ['Help', URLs.aiNotAvailable],
      ['Feedback', URLs.suggestFeature],
      ['Privacy', URLs.privacyPolicy],
      ['Support development', URLs.buyMeACoffee],
    ].map(([label, url]) => (
      <Link
        key={label}
        href={disabled ? undefined : url}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        target="_blank"
        rel="noreferrer"
        color="text.secondary"
      >
        {label}
      </Link>
    ))}
  </Box>
);
