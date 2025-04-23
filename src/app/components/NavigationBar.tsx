"use client";
import { useState, useEffect } from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Menu, Close } from "@mui/icons-material";

const sections = ["About", "Skillset", "Projects", "Contact", "Resume"];

const NavigationBar = () => {
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section) => {
        if (section === "Resume") return; // Skip tracking Resume
        const element = document.getElementById(section.toLowerCase());
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          // Handle the last tracked section (Contact)
          if (section === "Contact") {
            if (scrollPosition >= offsetTop * 0.8) {
              setActiveSection(section);
            }
          } else if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const targetElement = document.getElementById(id);
      if (targetElement) {
        const targetPosition = targetElement.offsetTop - 100;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const handleAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    section: string,
  ) => {
    event.preventDefault();

    const targetElement = document.getElementById(section.toLowerCase());
    if (targetElement) {
      const targetPosition = targetElement.offsetTop - 100;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }

    if (section.toLowerCase() === sections[0].toLowerCase()) {
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      window.history.pushState(null, "", `#${section.toLowerCase()}`);
    }

    // Close menu after click on mobile
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-4 lg:left-1/2 lg:transform lg:-translate-x-1/2 w-[80%] md:w-[90%] md:max-w-[1100px] md:h-16 z-10 bg-white/20 backdrop-blur-[3px] shadow-md md:rounded-full ${isMenuOpen ? "rounded-t-3xl" : "rounded-full"}`}
    >
      <div className="container mx-auto flex justify-between items-center h-full w-[90%] px-2 md:px-0">
        <div className="md:flex items-center">
          <span
            onClick={(e) => handleAnchorClick(e, sections[0])}
            className="flex items-center justify-center"
          >
            <img
              src="/sam_2019_darkmode_blue_gradient.svg"
              alt="React Logo"
              width="37"
            />
            <h1 className="ml-3 mb-0 md:inline hidden">Samuel Razali</h1>
            <h2 className="ml-3 mb-0 md:hidden inline">Samuel Razali</h2>
          </span>
        </div>

        {/* Navigation Items for Web*/}
        <ul className={"hidden md:flex items-center h-[100%]"}>
          {sections.map((section) => {
            const isResume = section.toLowerCase() === "resume";
            const id = isResume
              ? "https://heathered-efraasia-c7f.notion.site/Samuel-Razali-15c6f18f89a580169455e76b99d0ae7d?pvs=4"
              : `#${section.trim().toLowerCase()}`;
            const isActive =
              activeSection === section &&
              activeSection.toLowerCase() !== sections[0].toLowerCase();

            if (isResume) {
              return (
                <li key="resume" className="nav-link">
                  <a href={id} target="_blank">
                    <DescriptionOutlinedIcon
                      fontSize="small"
                      viewBox="8 0 10 30"
                    />
                    Resume
                  </a>
                </li>
              );
            }

            return (
              <li
                key={section.toLowerCase()}
                className={`nav-link ${isActive && "nav-link-active"}`}
              >
                <span
                  id={id}
                  onClick={
                    isResume ? undefined : (e) => handleAnchorClick(e, section)
                  }
                  className={`${
                    isActive && "active-link"
                  } ${isResume && "border-l-2 pl-4 block"}`}
                >
                  {section}
                </span>
              </li>
            );
          })}
        </ul>

        <span
          className="md:hidden m-0 h-16 content-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <Close /> : <Menu />}
        </span>
      </div>

      {/* Navigation Items for Mobile*/}
      {isMenuOpen && (
        <div
          className={
            "md:hidden backdrop-blur-[3px] bg-sky-900/60 shadow-md text-xl rounded-b-3xl z-50"
          }
        >
          {sections.map((section) => {
            const isResume = section.toLowerCase() === "resume";
            const id = isResume
              ? "https://heathered-efraasia-c7f.notion.site/Samuel-Razali-15c6f18f89a580169455e76b99d0ae7d?pvs=4"
              : `#${section.trim().toLowerCase()}`;
            const isActive = activeSection === section;

            if (isResume) {
              return (
                <span>
                  <div
                    className={`px-6 py-4 ${isActive && "bg-gradient-to-r from-sky-300/30 to-white/0"}`}
                  >
                    <DescriptionOutlinedIcon
                      fontSize="small"
                      viewBox="8 0 10 30"
                    />
                    Resume
                  </div>
                </span>
              );
            }

            return (
              <span
                id={id}
                key={section.toLowerCase()}
                onClick={
                  isResume ? undefined : (e) => handleAnchorClick(e, section)
                }
              >
                <div
                  className={`px-6 py-4 ${isActive && "bg-gradient-to-r from-sky-300/30 to-white/0"}`}
                >
                  {section}
                </div>
              </span>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
