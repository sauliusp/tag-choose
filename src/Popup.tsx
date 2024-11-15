import React, { useState, useEffect } from 'react';
import './popup.css';
import { useStoreContext } from './StoreContext';

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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Recent Bookmarks</h1>
      <ul className="space-y-2">
        <h1>{state.uiState}</h1>

        {bookmarks.map((bookmark) => (
          <li key={bookmark.id} className="border-b pb-2">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              {bookmark.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Popup;
