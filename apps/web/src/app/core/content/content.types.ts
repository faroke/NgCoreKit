export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingTime: number; // minutes
  content: string; // HTML string
};

export type Doc = {
  slug: string;
  title: string;
  order: number;
  section: string;
  content: string; // HTML string
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
};

export type ChangelogEntry = {
  slug: string;
  version: string;
  date: string;
  title: string;
  summary: string;
  content: string; // HTML string
};
