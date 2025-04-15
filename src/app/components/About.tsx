"use client";
import { useNotion } from "../notionContext";

const About = () => {
  const landingPageData = {};

  const { landingPage } = useNotion().data;

  if (landingPage) {
    landingPage.forEach(({ Title, Description }) => {
      Object.assign(landingPageData, { [`${Title}`]: Description });
    });

    return (
      <>
        <p
          dangerouslySetInnerHTML={{
            __html: landingPageData["Hero Image"],
          }}
        />
      </>
    );
  }

  return <h1>Landing Page not found</h1>;
};

export default About;
