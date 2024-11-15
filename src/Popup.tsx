import React, { useState, useEffect } from 'react';
import { useStoreContext } from './StoreContext';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  Paper,
} from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './popup.css';

const Popup: React.FC = () => {
  const { state } = useStoreContext();

  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);

  useEffect(() => {
    // Fetch recent bookmarks when popup opens
    chrome.bookmarks.getRecent(5, (results) => {
      setBookmarks(results);
    });
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Recent Bookmarks
      </Typography>
      <Typography variant="h6" component="h2">
        {state.uiState}
      </Typography>
      <List>
        {bookmarks.map((bookmark) => (
          <ListItem key={bookmark.id} divider>
            <ListItemText
              primary={
                <Link
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  underline="hover"
                >
                  {bookmark.title}
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Popup;
