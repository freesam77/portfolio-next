import React from 'react';
import Image from 'next/image';

type NavigationMenuDesktopProps = {
	navOnClick: (event: React.MouseEvent<HTMLElement>, mobile: boolean) => void;
	sections: string[];
	activeSection: string;
	parentClassName?: string;
}

const NavigationMenuDesktop = ({ navOnClick, activeSection, sections, parentClassName }: NavigationMenuDesktopProps) => {
	return (
		<nav
			className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[80%] max-w-[1100px] h-16 z-10 rounded-full ${parentClassName}`}
		>
			<div className="container mx-auto flex justify-between items-center h-full w-[90%] px-2">
				<div className="flex items-center">
					<Image src="/sam_2019_darkmode_blue_gradient.svg" alt="React Logo" width={37} height={37} />
					<h1 className="ml-3 mb-0">Samuel Razali</h1>
				</div>

				{/* Navigation Items for Web*/}
				<div className={'flex gap-4 text-lg'}>
					{sections.map((section) => {
						const id = `#${section.trim().toLowerCase()}`;
						const isActive = activeSection === section;

						return (
							<span
								key={section.toLowerCase()}
								className={`nav-link ${isActive && 'nav-link-active'}`}
							>
								<span
									id={id}
									onClick={(e) => navOnClick(e, false)}
									className={`${isActive && 'active-link'}`}
								>
									{section}
								</span>
							</span>
						);
					})}
				</div>
			</div>
		</nav>
	)
}

export default NavigationMenuDesktop