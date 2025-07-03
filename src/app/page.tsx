import NavigationBar from '@/components/sections/NavigationBar';
import About from '@/components/sections/About';
import Skillset from '@/components/sections/Skillset';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import AnimatedBG from '@/components/sections/AnimatedBG';
import Likes from '@/components/sections/Likes';
import { fetchPortfolioData } from '@/lib/portfolioData';

// Enable ISR with revalidation every 60 seconds (1 minute)
export const revalidate = process.env.NODE_ENV === 'production' ? 60 : false;

export default async function Home() {
	// Fetch data server-side
	const data = await fetchPortfolioData();

	return (
		<div>
			<AnimatedBG />
			<NavigationBar contactData={data?.contact} />
			<main className="pt-[100px] md:pt-0 mx-auto w-[80%] max-w-[950px]">
				<section id="about" className="flex flex-col justify-center min-h-screen mb-[100px]">
					<About landingPage={data?.landingPage} />
					<Likes likes={data?.likes} />
				</section>
				<section id="skillset" className="min-h-screen mb-[120px]">
					<h2 className="mb-10">Skillset</h2>
					<Skillset skillset={data?.skillset} />
				</section>
				<section id="projects" className="min-h-screen mb-[100px]">
					<h2 className="mb-10">Projects</h2>
					<Projects projects={data?.projects} />
				</section>
			</main>
			<section id="contact">
				<Contact contact={data?.contact} />
			</section>
		</div>
	);
}
