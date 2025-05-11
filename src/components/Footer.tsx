import React from 'react';
import { Box, Toolbar, AppBar, Link, Tooltip } from '@mui/material';
import { URLs } from '../parameters';

const links = [
  {
    label: "Doesn't work?",
    href: URLs.technicalDetails,
  },
  {
    label: 'Project Website',
    href: URLs.about,
  },
  {
    label: 'Suggest a Feature',
    href: URLs.suggestFeature,
  },
  {
    label: 'Write a Review',
    href: URLs.review,
    popoverText: 'Your positive review fuels my motivation ❤️',
  },
  // {
  //   label: 'Buy me a Coffee',
  //   href: URLs.buyMeACoffee,
  //   highlight: true,
  // },
];

export const Footer: React.FC = () => {
  return (
    <AppBar color="transparent" position="static" role="footer">
      <Toolbar
        sx={{ flexDirection: 'column', paddingTop: 3, paddingBottom: 2 }}
      >
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
            <React.Fragment key={link.label}>
              {link.popoverText ? (
                <Tooltip
                  title={link.popoverText}
                  placement="top"
                  arrow
                  open={true}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  PopperProps={{
                    sx: {
                      '& .MuiTooltip-tooltip': {
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 1,
                      },
                    },
                  }}
                >
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                    aria-label={link.label}
                    sx={{ color: 'text.secondary' }}
                  >
                    {link.label}
                  </Link>
                </Tooltip>
              ) : (
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  aria-label={link.label}
                  sx={{ color: 'text.secondary' }}
                >
                  {link.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </Box>

        <Box
          sx={{ textAlign: 'center', marginTop: 3 }}
          role="complementary"
          aria-label="Donation option"
        >
          <Link
            href="https://www.buymeacoffee.com/saulius.developer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buy me a coffee - opens in new tab"
          >
            <Tooltip
              title="🙏🙏🙏❤️❤️❤️"
              placement="right"
              arrow
              open={true}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              PopperProps={{
                sx: {
                  '& .MuiTooltip-tooltip': {
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 1,
                  },
                },
              }}
            >
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                style={{
                  height: '42px',
                  width: '152px',
                }}
              />
            </Tooltip>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
