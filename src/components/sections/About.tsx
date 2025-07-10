'use client';

interface AboutProps {
	landingPage?: string;
}

const About: React.FC<AboutProps> = ({ landingPage }) => {
	if (!landingPage) return <h1>Landing Page not found</h1>;

	return (
		<div
			className="about-section"
			dangerouslySetInnerHTML={{
				__html: landingPage,
			}}
		/>
	);
};

export default About;
