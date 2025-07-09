import React from 'react';
// about
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// skillset
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
// projects
import WysiwygOutlinedIcon from '@mui/icons-material/WysiwygOutlined';
// contacts
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';

const sectionIcons: Record<string, React.ReactNode> = {
  about: <InfoOutlinedIcon fontSize="small" />,
  skillset: <HandymanOutlinedIcon fontSize="small" />,
  projects: <WysiwygOutlinedIcon fontSize="small" />,
  contact: <RecentActorsOutlinedIcon fontSize="small" />,
};

type NavigationMenuDesktopProps = {
  navOnClick: (event: React.MouseEvent<HTMLElement>) => void;
  sections: string[];
  activeSection: string;
  parentClassName?: string;
};

const SectionNavItem = ({ section, navOnClick, isActive }: { section: string; navOnClick: (event: React.MouseEvent<HTMLElement>) => void; isActive: boolean }) => {
  const id = `#${section.trim().toLowerCase()}`;
  const icon = sectionIcons[section.trim().toLowerCase()] || null;
  return (
    <div key={id} className={`p-2 rounded-2xl flex-1 flex flex-col items-center ${isActive ? 'bg-sky-200/10' : ''}`}>
      <span
        id={id}
        onClick={navOnClick}
        className={`flex flex-col items-center cursor-pointer py-2 justify-end ${isActive ? 'nav-link-active' : 'nav-link'}`}
      >
        <span className='pb-2'>{icon}</span>
        {section.charAt(0).toUpperCase() + section.slice(1)}
      </span>
    </div>
  );
};

const NavigationMenuMobile = ({ navOnClick, activeSection, sections, parentClassName }: NavigationMenuDesktopProps) => {
  // Split sections for left and right of the logo
  const half = Math.ceil(sections.length / 2);
  const leftSections = sections.slice(0, half);
  const rightSections = sections.slice(half);

  return (
    <nav
      className={`fixed bottom-0 left-1/2 rounded-t-2xl transform -translate-x-1/2 w-full z-50 bg-black/30 backdrop-blur-md shadow-md flex justify-center ${parentClassName}`}
    >
      <div className="relative flex gap-2 w-full items-center justify-between p-4">
        {/* Left sections */}
        {leftSections.map((section) => (
          <SectionNavItem key={section} section={section} navOnClick={navOnClick} isActive={activeSection === section} />
        ))}
        {/* Center logo always rendered */}
        <div className="flex-1 flex flex-col items-center z-20 relative">
          <img src="/sam_2019_darkmode_blue_gradient.svg" alt="React Logo" width="55"/>
        </div>
        {/* Right sections */}
        {rightSections.map((section) => (
          <SectionNavItem key={section} section={section} navOnClick={navOnClick} isActive={activeSection === section} />
        ))}
      </div>
    </nav>
  );
};

export default NavigationMenuMobile;