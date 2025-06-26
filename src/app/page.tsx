"use client";
import NavigationBar from "./components/NavigationBar";
import About from "./components/About";
import Skillset from "./components/Skillset";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import AnimatedBG from "./components/AnimatedBG";
import Likes from "./components/Likes";

export default function Home() {
    return (
        <div>
            <AnimatedBG />
            <NavigationBar />
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
