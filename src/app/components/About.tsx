"use client";
import { useNotion } from "../notionContext";

const About = () => {
  const landingPage = useNotion().data?.landingPage;
  if (landingPage) {
    return (
      <>
        <p
          dangerouslySetInnerHTML={{
            __html: landingPage[0].Description,
          }}
        />
      </>
    );
  }

  return <h1>Landing Page not found</h1>;
};

export default About;
