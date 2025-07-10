import React from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import WysiwygOutlinedIcon from '@mui/icons-material/WysiwygOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';

const sectionIcons: Record<string, React.ReactNode> = {
	about: <InfoOutlinedIcon fontSize="small" />,
	skillset: <HandymanOutlinedIcon fontSize="small" />,
	projects: <WysiwygOutlinedIcon fontSize="small" />,
	contact: <RecentActorsOutlinedIcon fontSize="small" />,
};

type NavigationMenuDesktopProps = {
	navOnClick: (event: React.MouseEvent<HTMLElement>, mobile: boolean) => void;
	sections: string[];
	activeSection: string;
	parentClassName?: string;
};

const SectionNavItem = ({ section, navOnClick, isActive }: { section: string; navOnClick: (event: React.MouseEvent<HTMLElement>) => void; isActive: boolean }) => {
	const id = `#${section.trim().toLowerCase()}`;
	const icon = sectionIcons[section.trim().toLowerCase()] || null;

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		event.stopPropagation();
		// Create a synthetic event with the section text in order to prevent the icon from blocking nav onclick
		const syntheticEvent = {
			...event,
			target: {
				...event.target,
				textContent: section
			}
		} as React.MouseEvent<HTMLElement>;
		navOnClick(syntheticEvent);
	};

	return (
		<button key={id} onClick={handleClick} className={`p-2 rounded-3xl flex-1 flex flex-col cursor-pointer items-center ${isActive ? 'bg-gradient-to-b from-sky-200/30 to-slate-900/10' : ''} ${isActive ? 'nav-link-active' : 'nav-link'}`}>
			<span className='pb-2' onClick={handleClick}>{icon}</span>
			{section.charAt(0).toUpperCase() + section.slice(1)}
		</button>
	);
};

const NavigationMenuMobile = ({ navOnClick, activeSection, sections, parentClassName }: NavigationMenuDesktopProps) => {
	// Split sections for left and right of the logo
	const half = Math.ceil(sections.length / 2);
	const leftSections = sections.slice(0, half);
	const rightSections = sections.slice(half);

	return (
		<nav
			className={`fixed bottom-0 left-1/2 rounded-t-3xl transform -translate-x-1/2 w-full z-50 flex justify-center ${parentClassName}`}
		>
			<div className="relative flex gap-2 w-full items-center justify-between p-4">
				{/* Left sections */}
				{leftSections.map((section) => (
					<SectionNavItem key={section} section={section} navOnClick={(e) => navOnClick(e, true)} isActive={activeSection === section} />
				))}
				{/* Center logo always rendered */}
				<div className="flex-1 flex flex-col items-center z-20 relative">
					<img src="/sam_2019_darkmode_blue_gradient.svg" alt="React Logo" width="55" />
				</div>
				{/* Right sections */}
				{rightSections.map((section) => (
					<SectionNavItem key={section} section={section} navOnClick={(e) => navOnClick(e, true)} isActive={activeSection === section} />
				))}
			</div>
		</nav>
	);
};

export default NavigationMenuMobile;