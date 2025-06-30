import NavigationBar from "./components/NavigationBar";
import About from "./components/About";
import Skillset from "./components/Skillset";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import AnimatedBG from "./components/AnimatedBG";
import Likes from "./components/Likes";
import { fetchPortfolioData } from "./lib/portfolioData";

// Enable ISR with revalidation every 60 seconds (1 minute)
export const revalidate = 60;

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
