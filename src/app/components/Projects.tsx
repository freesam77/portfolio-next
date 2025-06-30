"use client"
import { LinkRounded } from "@mui/icons-material";
import ProjectModal from "./ProjectModal";
import { useState } from "react";

interface ProjectData {
    id: string;
    projectName: string;
    description: string;
    stack: string[];
    order: number;
    hidden?: boolean;
    mediaUrl?: string;
    url?: string;
}

interface ProjectsProps {
    projects?: ProjectData[];
}

const Projects: React.FC<ProjectsProps> = ({ projects = [] }) => {
    const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalProject, setModalProject] = useState<{ mediaUrl?: string, projectName: string } | null>(null);

    const handleImageClick = (mediaUrl?: string, projectName = "") => {
        setModalProject({ mediaUrl, projectName });
        setModalOpen(true);
    };

    return (
        <>
            <div>
                {sortedProjects.map((project: ProjectData) => {
                    if (project.hidden) return null;
                    return (
                        <div className="card md:flex items-start p-8 md:p-4 mb-4" key={`${project.projectName}-${project.order}`}>
                            <img
                                className={`md:mr-8 m-auto md:m-0 w-[250px] h-[100%] ring-2 ring-slate-400 rounded-sm ${project.mediaUrl ? "cursor-pointer hover:ring-sky-400" : ""}`}
                                src={project.mediaUrl || "https://placehold.co/600x400?text=No+Preview"}
                                alt={project.projectName}
                                onClick={() => handleImageClick(project.mediaUrl, project.projectName)}
                            />
                            <div className="mt-4 md:mt-0 flex-1 align-top">
                                <div className="md:flex justify-between mb-4 items-baseline" >
                                    <div className="m-auto md:m-0">
                                        <h2 className="mx-auto text-center md:text-left">
                                            {project.projectName}
                                        </h2>
                                        <div className="flex flex-wrap mb-4 justify-center md:justify-normal">
                                            {project.stack.sort().map((stackItem, index) => (
                                                <span
                                                    className="bg-sky-900 shadow-sm rounded-md px-2 py-1 mr-2 my-2 md:mt-0 text-xs"
                                                    key={`${stackItem}-${index}`}
                                                >
                                                    {stackItem}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {project.url && (
                                        <a href={project.url} className="flex items-center ml-4" target="_blank">
                                            <LinkRounded />
                                            <p className="md:hidden ml-1 italic">Link to Project</p>
                                        </a>
                                    )}
                                </div>
                                <section
                                    className="mb-4"
                                    dangerouslySetInnerHTML={{ __html: project.description }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {modalProject && (
                <ProjectModal
                    mediaUrl={modalProject.mediaUrl}
                    projectName={modalProject.projectName}
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
};

export default Projects;
