export const MAIN_PREFIX = 'posts';

export const BlogPostPath = {
  VIDEO: `/${MAIN_PREFIX}/video`,
  TEXT: `/${MAIN_PREFIX}/text`,
  QUOTE: `/${MAIN_PREFIX}/quote`,
  LINK: `/${MAIN_PREFIX}/link`,
  IMAGE: `/${MAIN_PREFIX}/image`,
} as const;
