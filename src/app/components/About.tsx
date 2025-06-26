"use client";
import { useEffect, useReducer } from "react";
import SectionLoading from "./SectionLoading";
import ErrorComponent from "./ErrorComponent";
import { notionReducer, initialState } from "../context/notionReducer";

const About = () => {
    const [state, dispatch] = useReducer(notionReducer, initialState);

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_START" });
            try {
                const response = await fetch("/api/notion/landingPage");
                if (!response.ok) throw new Error("Failed to fetch landing page data");
                const result = await response.json();
                dispatch({ type: "FETCH_SUCCESS", payload: { landingPage: result.landingPage } });
            } catch (err: unknown) {
                if (err instanceof Error) dispatch({ type: "FETCH_ERROR", error: err.message });
                else dispatch({ type: "FETCH_ERROR", error: "Unknown error" });
            }
        };
        fetchData();
    }, []);

    if (state.loading) return <SectionLoading />;
    if (state.error) return <ErrorComponent error={state.error} />;
    if (!state.data?.landingPage) return <h1>Landing Page not found</h1>;
    return (
        <section
            className="about-section"
            dangerouslySetInnerHTML={{
                __html: state.data.landingPage,
            }}
        />
    );
};

export default About;
