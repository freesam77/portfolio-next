"use client";
import { LinkRounded } from "@mui/icons-material";
import { useNotion } from "../notionContext";
import Modal from "./Modal";
import { useState } from "react";

interface ProjectData {
  projectName: string;
  client: string;
  description: string;
  stack: string[];
  url: string;
  mediaUrl: string;
  hidden: boolean;
  order: number;
}

type ProjectSectionProps = {
  projectData?: ProjectData;
};

const ProjectSection = (props: ProjectSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { projectData } = props;
  if (!projectData) {
    return <div>There is no project data</div>;
  }

  const projectDetails = () => (
    <div className="mt-4 md:mt-0">
      <div className="md:flex justify-between mb-4">
        <div className="m-auto md:m-0">
          <h2 className="mx-auto text-center md:text-left">
            {projectData.projectName}
          </h2>
          <ul className="flex flex-wrap mb-4 justify-center md:justify-normal">
            {projectData.stack.sort().map((stackItem, index) => (
              <li
                className="bg-sky-900 shadow-sm rounded-md px-2 py-1 mr-2 mt-2 md:mt-0 text-xs"
                key={`${stackItem}-${index}`}
              >
                {stackItem}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p
        className="mb-4"
        dangerouslySetInnerHTML={{ __html: projectData.description }}
      />
    </div>
  );

  return (
    <div>
      <div className="card md:flex align-top p-8 md:p-4 mb-4">
        <img
          className={`md:mr-8 w-[250px] h-[100%] ring-2 ring-slate-400 rounded-sm ${projectData.mediaUrl && "cursor-pointer hover:ring-sky-400"}`}
          src={
            projectData.mediaUrl ||
            "https://placehold.co/600x400?text=No+Preview"
          }
          onClick={() => {
            if (projectData.mediaUrl) {
              setModalOpen(true);
            }
          }}
        />

        {projectDetails()}
        {projectData.url && (
          <a
            href={projectData.url}
            className="flex justify-end md:justify-start"
          >
            <LinkRounded />
            <p className="md:hidden ml-1 italic">Link to Project</p>
          </a>
        )}
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <img
          className="rounded-sm mx-auto"
          src={
            projectData.mediaUrl ||
            "https://placehold.co/600x400?text=No+Preview"
          }
        />
      </Modal>
    </div>
  );
};

const Projects = () => {
  const projects = useNotion().data?.projects || [];

  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

  return (
    <div>
      {sortedProjects.map((project: ProjectData) => {
        return (
          !project.hidden && (
            <ProjectSection
              projectData={project}
              key={`${project.projectName}-${project.order}`}
            />
          )
        );
      })}
    </div>
  );
};

export default Projects;
