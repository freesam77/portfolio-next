"use client";
import NavigationBar from "./components/NavigationBar";
import About from "./components/About";
import Skillset from "./components/Skillset";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import AnimatedBG from "./components/AnimatedBG";
import Likes from "./components/Likes";
import { usePortfolio } from "./context/PortfolioContext";
import Loading from "./components/Loading";

export default function Home() {
    const { data, loading, error } = usePortfolio();

    if (loading) {
        return <div>
            <AnimatedBG />
            <Loading />
        </div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-lg text-red-600">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AnimatedBG />
            <NavigationBar contactData={data?.contact} />
            <main className="pt-[100px] md:pt-0 mx-auto w-[80%] max-w-[950px]">
                <section id="about" className="flex flex-col justify-center min-h-screen mb-[100px]">
                    <About />
                    <Likes />
                </section>
                <section id="skillset" className="min-h-screen mb-[120px]">
                    <h2 className="mb-10">Skillset</h2>
                    <Skillset />
                </section>
                <section id="projects" className="min-h-screen mb-[100px]">
                    <h2 className="mb-10">Projects</h2>
                    <Projects />
                </section>
            </main>
            <section id="contact">
                <Contact />
            </section>
        </div>
    );
}
