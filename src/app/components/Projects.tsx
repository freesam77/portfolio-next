"use client";
import { LinkRounded } from "@mui/icons-material";
import Modal from "./Modal";
import { useState } from "react";
import type { ProjectData } from "../types";

const ProjectSection = ({ data }: { data: ProjectData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  if (!data) {
    return <div>There is no project data</div>;
  }

  const projectDetails = () => (
    <div className="mt-4 md:mt-0">
      <div className="md:flex justify-between mb-4">
        <div className="m-auto md:m-0">
          <h2 className="mx-auto text-center md:text-left">
            {data.projectName}
          </h2>
          <div className="flex flex-wrap mb-4 justify-center md:justify-normal">
            {data.stack.sort().map((stackItem, index) => (
              <span
                className="bg-sky-900 shadow-sm rounded-md px-2 py-1 mr-2 mt-2 md:mt-0 text-xs"
                key={`${stackItem}-${index}`}
              >
                {stackItem}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p
        className="mb-4"
        dangerouslySetInnerHTML={{ __html: data.description }}
      />
    </div>
  );

  return (
    <div>
      <div className="card md:flex align-top p-8 md:p-4 mb-4">
        <img
          className={`md:mr-8 m-auto md:m-0 w-[250px] h-[100%] ring-2 ring-slate-400 rounded-sm ${data.mediaUrl && "cursor-pointer hover:ring-sky-400"}`}
          src={data.mediaUrl || "https://placehold.co/600x400?text=No+Preview"}
          onClick={() => {
            if (data.mediaUrl) {
              setModalOpen(true);
            }
          }}
        />

        {projectDetails()}
        {data.url && (
          <a href={data.url} className="flex justify-end md:justify-start" target="_blank">
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
          src={data.mediaUrl || "https://placehold.co/600x400?text=No+Preview"}
        />
      </Modal>
    </div>
  );
};

const Projects = ({ data }: { data: ProjectData[] }) => {
  const sortedProjects = [...data].sort((a, b) => a.order - b.order);

  return (
    <div>
      {sortedProjects.map((project: ProjectData) => {
        return (
          !project.hidden && (
            <ProjectSection
              data={project}
              key={`${project.projectName}-${project.order}`}
            />
          )
        );
      })}
    </div>
  );
};

export default Projects;
