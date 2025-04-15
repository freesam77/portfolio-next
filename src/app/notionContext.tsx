"use client";
import { createContext, useState, useEffect, useContext } from "react";
import notionLoad from "@/app/actions/notion";

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
  <div className="fixed top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%]">
    <h1 className="text-4xl animate-pulse">Loading</h1>
    <div className="flex justify-center items-center space-x-3 mt-6">
      <div className="w-3 h-3 bg-sky-200 rounded-sm animate-bounce-delay-150" />
      <div className="w-3 h-3 bg-sky-200 rounded-sm animate-bounce-delay-300" />
      <div className="w-3 h-3 bg-sky-200 rounded-sm animate-bounce-delay-600" />
    </div>
  </div>
);

const storedData =
  typeof window !== "undefined"
    ? localStorage.getItem("portfolioDataCache")
    : "";

// Notion Provider Component
export const NotionProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState(() => {
    return storedData ? JSON.parse(storedData) : null;
  });
  const [loading, setLoading] = useState(true);
  const fetchNotionData = async () => {
    try {
      const response = await notionLoad();
      const result = response.body;

      if (JSON.stringify(data) !== JSON.stringify(result)) {
        setData(JSON.parse(result));
        setLoading(false);
        localStorage.setItem("portfolioDataCache", JSON.stringify(result));
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
