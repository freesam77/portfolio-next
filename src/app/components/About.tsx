"use client";
import { useEffect, useState } from "react";
import type { LandingPageData } from "../types";
import SectionLoading from "./SectionLoading";
import ErrorComponent from "./ErrorComponent";

const About = () => {
    const [data, setData] = useState<LandingPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/notion/landingPage");
                if (!response.ok) throw new Error("Failed to fetch landing page data");
                const result = await response.json();
                setData(result.landingPage ?? null);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <SectionLoading />;
    if (error) return <ErrorComponent error={error} />;
    if (!data) return <h1>Landing Page not found</h1>;

    return (
        <section
            className="about-section"
            dangerouslySetInnerHTML={{
                __html: data,
            }}
        />
    );
};

export default About;
