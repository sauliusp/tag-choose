import React from 'react';
import { Box, Toolbar, AppBar, Link, Tooltip } from '@mui/material';
import { URLs } from '../parameters';
import { PromoLink } from '../types/PromoLink';

const leftLinks: PromoLink[] = [
  {
    label: 'Visit website',
    href: URLs.about,
  },
  {
    label: 'Suggest a feature',
    href: URLs.suggestFeature,
    popoverText: '🙏',
  },
];

const rightLinks: PromoLink[] = [
  {
    label: 'Write a review',
    href: URLs.review,
    popoverText: '🙏',
  },
  {
    label: 'Rate #TagChoose',
    href: URLs.rateExtension,
    popoverText: '🙏',
  },
];

export const Footer: React.FC = () => {
  const renderLinks = (links: PromoLink[]) => {
    return links.map((link) => (
      <React.Fragment key={link.label}>
        {link.popoverText ? (
          <Tooltip
            title={link.popoverText}
            placement="top"
            arrow
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
              aria-label={link.label}
              color="text.secondary"
              underline="hover"
            >
              {link.label}
            </Link>
          </Tooltip>
        ) : (
          <Link
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            color="text.secondary"
            underline="hover"
          >
            {link.label}
          </Link>
        )}
      </React.Fragment>
    ));
  };

  return (
    <AppBar color="transparent" position="static" role="footer">
      <Toolbar sx={{ flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexGrow: 1,
            alignItems: 'center',
          }}
        >
          {renderLinks(leftLinks)}

          <Link
            href="https://www.buymeacoffee.com/saulius.developer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buy me a coffee - opens in new tab"
          >
            <Tooltip
              title="🙏🙏🙏❤️❤️❤️"
              placement="top"
              arrow
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
                  height: '32px',
                  width: '114px',
                }}
              />
            </Tooltip>
          </Link>

          {renderLinks(rightLinks)}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
