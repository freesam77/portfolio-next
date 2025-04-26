"use client";
import type { LandingPageData } from "../types";

const About = ({ data }: { data: LandingPageData }) => {
  if (data) {
    return (
      <section
      className="about-section"
        dangerouslySetInnerHTML={{
          __html: data,
        }}
      />
    );
  }

  return <h1>Landing Page not found</h1>;
};

export default About;
