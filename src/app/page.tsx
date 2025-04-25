"use client";
import NavigationBar from "./components/NavigationBar";
import About from "./components/About";
import Skillset from "./components/Skillset";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import AnimatedBG from "./components/AnimatedBG";
import PixelatedLoading from "./components/Loading";
import ErrorComponent from "./components/ErrorComponent";
import { useEffect, useReducer } from "react";
import { notionReducer, initialState } from "./context/notionReducer";

export default function Home() {
  const [state, dispatch] = useReducer(notionReducer, initialState);
  const { data, loading, error } = state;

  useEffect(() => {
    const fetchNotionData = async () => {
      dispatch({ type: "FETCH_START" });

      try {
        const response = await fetch("/api/notion");
        const result = await response.json();
        dispatch({ type: "FETCH_SUCCESS", payload: result });
      } catch (error: unknown) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        dispatch({
          type: "FETCH_ERROR",
          error: message ?? "Something went wrong",
        });
        console.error("Error fetching Notion data:", error);
      }
    };

    fetchNotionData();
  }, []);

  return (
    <div>
      <AnimatedBG />
      {loading ? (
        <PixelatedLoading />
      ) : error ? (
        <ErrorComponent error={error} />
      ) : data ? (
        <>
          <NavigationBar />
          <main className="pt-[100px] md:pt-0 mx-auto w-[80%] max-w-[950px]">
            <div
              id="about"
              className="flex flex-col justify-center min-h-screen mb-[100px] whitespace-pre-line"
            >
              {data.landingPage && <About data={data.landingPage} />}
            </div>
            <div id="skillset" className="min-h-screen mb-[120px]">
              <h1 className="mb-10">Skillset</h1>
              {data.skillset && <Skillset data={data.skillset} />}
            </div>
            <div id="projects" className="min-h-screen mb-[100px]">
              <h1 className="mb-10">Projects</h1>
              {data.projects && <Projects data={data.projects} />}
            </div>
          </main>
          <div id="contact">
            {data.contact && <Contact data={data.contact} />}
          </div>
        </>
      ) : null}
    </div>
  );
}
