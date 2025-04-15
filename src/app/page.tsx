import { NotionProvider } from "./notionContext";
import NavigationBar from "./components/NavigationBar";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import AnimatedBG from "./components/AnimatedBG";

export default function Home() {
  return (
    <div className="mx-auto w-[80%] max-w-[950px] pt-[100px] md:pt-0">
      <AnimatedBG />
      <NotionProvider>
        <NavigationBar />
        <div
          id="about"
          className="flex flex-col justify-center min-h-screen whitespace-pre-line"
        >
          <About />
        </div>
        <div id="skillset" className="min-h-screen mb-[60px]">
          <h1 className="mb-10">Skillset</h1>
          <Skills />
        </div>
        <div id="projects" className="mb-[80px]">
          <h1 className="mb-10">Projects</h1>
          <Projects />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </NotionProvider>
    </div>
  );
}
