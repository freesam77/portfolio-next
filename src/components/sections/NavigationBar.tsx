'use client';
import { useState, useEffect, useCallback } from 'react';
import NavigationMenuDesktop from '../customized/NavigationMenuDesktop';
import NavigationMenuMobile from "../customized/NavigationMenuMobile"

const scrollLogic = (id: string, mobile: boolean) => {
	const targetElement = document.getElementById(id);
	const offset = mobile ? 20 : 100
	if (targetElement) {
		const targetPosition = targetElement.offsetTop - offset;
		window.scrollTo({
			top: targetPosition,
			behavior: 'smooth',
		});
	}
};

const baseSections = ['About', 'Skillset', 'Projects', 'Contact']

const NavigationBar = () => {
	const [activeSection, setActiveSection] = useState('About');
	// Callback functions
	const setActiveOnScroll = useCallback(() => {
		const scrollPosition = window.scrollY + window.innerHeight / 2;

		baseSections.forEach((section) => {
			const element = document.getElementById(section.toLowerCase());
			if (element) {
				const { offsetTop, offsetHeight } = element;
				console.log({section: section.toLowerCase(), element, scrollPosition, offsetTop, offsetHeight, total: offsetTop + offsetHeight})
				// Handle the last tracked section (Contact)
				if (section === 'Contact') {
					if (scrollPosition >= offsetTop * 0.8) {
						setActiveSection(section);
					}
				} else if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
					setActiveSection(section);
				}
			}
		});
	}, []);

	const scrollToID = useCallback((mobile: boolean) => {
		const hash = window.location.hash;
		if (hash) {
			const id = hash.replace('#', '');
			scrollLogic(id, mobile);
		}
	}, []);

	const navOnClick = (event: React.MouseEvent<HTMLElement>, mobile: boolean) => {
		const section = (event.target as HTMLElement).textContent;
		if (!section) return;
		scrollLogic(section.toLowerCase(), mobile);

		if (section.toLowerCase() === baseSections[0].toLowerCase()) {
			window.history.replaceState(null, '', window.location.pathname);
		} else {
			window.history.pushState(null, '', `#${section.toLowerCase()}`);
		}
	}

	useEffect(() => {
		setTimeout(() => {
			scrollToID(true);
		}, 480);

		window.addEventListener('scroll', setActiveOnScroll);
		return () => window.removeEventListener('scroll', setActiveOnScroll);
	}, [scrollToID, setActiveOnScroll]);

	return (
		<>
			<NavigationMenuDesktop navOnClick={navOnClick} sections={baseSections} activeSection={activeSection} parentClassName="hidden md:block" />
			<NavigationMenuMobile navOnClick={navOnClick} sections={baseSections} activeSection={activeSection} parentClassName="block md:hidden" />
		</>
	);
};

export default NavigationBar;
