"use client";
import { useState, useEffect } from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Menu, Close } from "@mui/icons-material";

const sections = ["About", "Skillset", "Projects", "Contact", "Resume"];

const NavigationBar = () => {
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggling menu

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

  const handleAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    section: string,
  ) => {
    event.preventDefault();

    const targetElement = document.getElementById(section.toLowerCase());
    if (targetElement) {
      const targetPosition = targetElement.offsetTop * 0.9;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }

    // Close menu after click on mobile
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-4 lg:left-1/2 lg:transform lg:-translate-x-1/2 w-[80%] md:w-[90%] md:max-w-[1100px] h-16 z-10 bg-white/20 backdrop-blur-[3px] shadow-md md:rounded-full ${isMenuOpen ? "rounded-t-3xl" : "rounded-full"}`}
    >
      <div className="container mx-auto flex justify-between items-center h-full w-[90%] px-2 md:px-0">
        <div className="md:flex items-center">
          <a
            href={`#${sections[0].toLowerCase()}`}
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
          </a>
        </div>

        {/* Navigation Items for Web*/}
        <ul className={"hidden md:flex space-x-6 items-center"}>
          {sections.map((section) => {
            const isResume = section.toLowerCase() === "resume";
            const href = isResume
              ? "https://heathered-efraasia-c7f.notion.site/Samuel-Razali-15c6f18f89a580169455e76b99d0ae7d?pvs=4"
              : `#${section.trim().toLowerCase()}`;
            const isActive = activeSection === section;

            return (
              <li key={section.toLowerCase()}>
                <a
                  href={href}
                  onClick={
                    isResume ? undefined : (e) => handleAnchorClick(e, section)
                  }
                  className={`${
                    isActive && "active-link"
                  } ${isResume && "border-l-2 pl-4 block"}`}
                  target={isResume ? "_blank" : undefined}
                  rel={isResume ? "noopener noreferrer" : undefined}
                >
                  {isResume ? (
                    <span>
                      <DescriptionOutlinedIcon
                        fontSize="small"
                        viewBox="8 0 10 30"
                      />
                      Resume
                    </span>
                  ) : (
                    section
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <Close /> : <Menu />}
        </button>
      </div>

      {/* Navigation Items for Mobile*/}
      {isMenuOpen && (
        <div
          className={
            "md:hidden backdrop-blur-lg bg-sky-900/90 shadow-md text-xl rounded-b-3xl z-50"
          }
        >
          {sections.map((section) => {
            const isResume = section.toLowerCase() === "resume";
            const href = isResume
              ? "https://heathered-efraasia-c7f.notion.site/Samuel-Razali-15c6f18f89a580169455e76b99d0ae7d?pvs=4"
              : `#${section.trim().toLowerCase()}`;
            const isActive = activeSection === section;

            return (
              <a
                href={href}
                key={section.toLowerCase()}
                onClick={
                  isResume ? undefined : (e) => handleAnchorClick(e, section)
                }
                target={isResume ? "_blank" : undefined}
                rel={isResume ? "noopener noreferrer" : undefined}
              >
                <div
                  className={`px-6 py-4 ${isActive && "bg-gradient-to-r from-sky-300/30 to-white/0"}`}
                >
                  {isResume ? (
                    <span>
                      <DescriptionOutlinedIcon
                        fontSize="small"
                        viewBox="8 0 10 30"
                      />
                      Resume
                    </span>
                  ) : (
                    section
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
