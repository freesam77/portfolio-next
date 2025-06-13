export interface LandingPageData {
  description: string;
}

export interface ProjectData {
  projectName: string;
  client: string;
  description: string;
  stack: string[];
  url: string;
  mediaUrl: string;
  hidden: boolean;
  order: number;
}

export interface SkillsetData {
  skill: string;
  categories: string[];
  description: string;
  icon: string;
  hidden: boolean;
}

export interface ContactData {
  OnlinePresence: string;
  Links: string;
  Icon: string;
}

export type NotionDataType = {
  landingPage?: LandingPageData;
  likes?: LikeItem[];
  skillset?: SkillsetData[];
  projects?: ProjectData[];
  contact?: ContactData[];
};

export type NotionContextType = {
  data: NotionDataType | null;
  loading: boolean;
};

export interface LikeItem {
  tagline: string;
  likes: string;
}
