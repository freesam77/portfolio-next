import NavigationBar from '@/components/sections/NavigationBar';
import About from '@/components/sections/About';
import Skillset from '@/components/sections/Skillset';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import AnimatedBG from '@/components/sections/AnimatedBG';
import Likes from '@/components/sections/Likes';
import { fetchPortfolioData } from '@/lib/portfolioData';

// Enable ISR with revalidation every 60 seconds (1 minute)
export const revalidate = 60;

export default async function Home() {
	// Fetch data server-side
	const data = await fetchPortfolioData();

	return (
		<div>
			<AnimatedBG />
			<NavigationBar />
			<main className="mx-auto w-[80%] max-w-[950px]">
				<section id="about">
					<About landingPage={data?.landingPage} />
					<Likes likes={data?.likes} />
				</section>
				<section id="skillset">
					<h2 >Skillset</h2>
					<Skillset skillset={data?.skillset} />
				</section>
				<section id="projects">
					<h2>Projects</h2>
					<Projects projects={data?.projects} />
				</section>
			</main>
			<footer id="contact">
				<Contact contact={data?.contact} />
			</footer>
		</div>
	);
}
