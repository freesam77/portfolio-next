"use client";
import { usePortfolio } from "../context/PortfolioContext";

const About = () => {
    const { data } = usePortfolio();

    if (!data?.landingPage) return <h1>Landing Page not found</h1>;
    
    return (
        <section
            className="about-section"
            dangerouslySetInnerHTML={{
                __html: data.landingPage,
            }}
        />
    );
};

export default About;
