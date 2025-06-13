"use client";
import NavigationBar from "./components/NavigationBar";
import About from "./components/About";
import Skillset from "./components/Skillset";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import AnimatedBG from "./components/AnimatedBG";
import ErrorComponent from "./components/ErrorComponent";
import SectionLoading from "./components/SectionLoading";
import { useCallback, useEffect, useReducer, useState } from "react";
import { notionReducer, initialState } from "./context/notionReducer";
import Likes from "./components/Likes";
import type { NotionDataType } from "./types";
import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";

type SectionState = {
  landingPage: boolean;
  skillset: boolean;
  projects: boolean;
  contact: boolean;
};

type SectionLoadingState = {
  landingPage: boolean;
  likes: boolean;
  projects: boolean;
  skillset: boolean;
  contact: boolean;
};

export default function Home() {
  const [state, dispatch] = useReducer(notionReducer, initialState);
  const { data, loading, error } = state;
  const [sectionLoading, setSectionLoading] = useState<SectionLoadingState>({
    landingPage: true,
    likes: true,
    projects: true,
    skillset: true,
    contact: true,
  });
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isLoading, setIsLoading] = useState(true);
  const [sectionStates, setSectionStates] = useState<SectionState>({
    landingPage: false,
    skillset: false,
    projects: false,
    contact: false,
  });

  const fetchSection = useCallback(async (section: string) => {
    setSectionLoading(prev => ({ ...prev, [section]: true }));
    try {
      const response = await fetch(`/api/notion/${section}`);
      const result = await response.json();
      setSectionLoading(prev => ({ ...prev, [section]: false }));
      return result;
    } catch (error: unknown) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      console.error(`Error fetching ${section}:`, error);
      setSectionLoading(prev => ({ ...prev, [section]: false }));
      throw new Error(message ?? "Something went wrong");
    }
  }, []);

  const fetchAllSections = useCallback(async () => {
    dispatch({ type: "FETCH_START" });

    try {
      const [landingPage, likes, projects, skillset, contact] = await Promise.all([
        fetchSection("landingPage"),
        fetchSection("likes"),
        fetchSection("projects"),
        fetchSection("skillset"),
        fetchSection("contact"),
      ]);

      const combinedData = {
        ...landingPage,
        ...likes,
        ...projects,
        ...skillset,
        ...contact,
      };

      dispatch({ type: "FETCH_SUCCESS", payload: combinedData });
    } catch (error: unknown) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      dispatch({
        type: "FETCH_ERROR",
        error: message ?? "Something went wrong",
      });
    }
  }, [fetchSection]);

  useEffect(() => {
    fetchAllSections();
  }, [fetchAllSections]);

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div>
      <AnimatedBG />
      {loading ? (
        <div className="min-h-screen">
          <SectionLoading />
        </div>
      ) : (
        <>
          <NavigationBar />
          <main className="pt-[100px] md:pt-0 mx-auto w-[80%] max-w-[950px]">
            <div id="about" className="flex flex-col justify-center min-h-screen mb-[100px]">
              {sectionLoading.landingPage && <SectionLoading />}
              {data?.landingPage && <About data={data.landingPage} />}
              {sectionLoading.likes && <SectionLoading />}
              {data?.likes && <Likes data={data.likes} delay={4000} />}
            </div>
            <div id="skillset" className="min-h-screen mb-[120px]">
              <h1 className="mb-10">Skillset</h1>
              {sectionLoading.skillset && <SectionLoading />}
              {data?.skillset && (
                <Skillset
                  data={data.skillset.filter(({ category, hidden }) => {
                    return !hidden && category !== "Softskills";
                  })}
                />
              )}
            </div>
            <div id="projects" className="min-h-screen mb-[100px]">
              <h1 className="mb-10">Projects</h1>
              {sectionLoading.projects && <SectionLoading />}
              {data?.projects && <Projects data={data.projects} />}
            </div>
          </main>
          <div id="contact">
            {sectionLoading.contact && <SectionLoading />}
            {data?.contact && <Contact data={data.contact} />}
          </div>
        </>
      )}
    </div>
  );
}
