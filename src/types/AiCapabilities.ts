export type AiCapabilities =
  | AILanguageModelCapabilities
  | 'unsupported'
  | 'available'
  | 'unavailable'
  | 'downloading'
  | 'downloadable';
