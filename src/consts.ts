import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Ambraglow's Shack",
  EMAIL: "contact@ambraglow.org",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "ambraglow's blog",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "my blog :3",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
  {
    NAME: "Discord: Ambraglow",
    HREF: ""
  },
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
