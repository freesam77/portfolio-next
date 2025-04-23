"use client";
import { createContext, useState, useEffect, useContext } from "react";
import PixelatedLoading from "./components/Loading";

interface LandingPageData {
  Title: string;
  Description: string;
}

interface ProjectData {
  projectName: string;
  client: string;
  description: string;
  stack: string[];
  url: string;
  mediaUrl: string;
  hidden: boolean;
  order: number;
}

interface Skill {
  mastery: number;
  categories: string[];
  skill: string;
  src: string;
}

interface ContactData {
  OnlinePresence: string;
  Links: string;
  Icon: string;
}

type NotionDataType = {
  landingPage?: LandingPageData[];
  contact?: ContactData[];
  projects?: ProjectData[];
  skillset?: Skill[];
};

type NotionContextType = {
  data: NotionDataType | null;
  loading: boolean;
};

const NotionContext = createContext<NotionContextType>({
  data: null,
  loading: true,
});

const LoadingAnimation = () => (
  <div className="h-screen flex items-center justify-center">
    <PixelatedLoading />
  </div>
);

export const NotionProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchNotionData = async () => {
    try {
      const response = await fetch("/api/notion", { cache: "no-store" });
      const result = await response.json();

      if (JSON.stringify(data) !== JSON.stringify(result)) {
        setData(result);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Notion data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotionData();
  }, []);

  return (
    <NotionContext.Provider value={{ data, loading }}>
      {loading === true ? <LoadingAnimation /> : children}
    </NotionContext.Provider>
  );
};

export const useNotion = () => useContext(NotionContext);
