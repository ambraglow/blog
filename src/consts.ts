import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Ambraglow",
  EMAIL: "contact@ambraglow.org",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Astro Nano is a minimal and lightweight blog and portfolio.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};


export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "Github",
    HREF: "https://github.com/ambraglow"
  },
  { 
    NAME: "Bluesky",
    HREF: "https://bsky.app/profile/ambraglow.org",
  },
  { 
    NAME: "Flickr",
    HREF: "https://www.flickr.com/photos/190109522@N05/",
  }
];
