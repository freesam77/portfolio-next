"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface LikeData {
  id: string;
  likes: string;
  tagline?: string;
  icon?: string;
  hidden?: boolean;
}

interface ProjectData {
  id: string;
  projectName: string;
  description: string;
  stack: string[];
  order: number;
  hidden?: boolean;
}

interface SkillData {
  id: string;
  name: string;
  skill: string;
  categories?: string[];
  hidden?: boolean;
}

interface ContactData {
  id: string;
  OnlinePresence: string;
  Links: string;
  Icon?: string;
}

interface PortfolioData {
  landingPage?: string;
  likes?: LikeData[];
  projects?: ProjectData[];
  skillset?: SkillData[];
  contact?: ContactData[];
}

interface PortfolioContextType {
  data: PortfolioData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/notion');
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return (
    <PortfolioContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </PortfolioContext.Provider>
  );
}; 