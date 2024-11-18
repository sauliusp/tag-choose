/* eslint-disable */
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  console.log('New bookmark created:', bookmark);
});

chrome.bookmarks.onRemoved.addListener((id) => {
  console.log('Bookmark deleted:', id);
});

chrome.bookmarks.onRemoved.addListener((id) => {
  console.log('Bookmark deleted:', id);
});

export {};
