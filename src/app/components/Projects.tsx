"use client";
import { useState } from "react";
import Image from "next/image";
import type { ProjectData } from "../types";

const ProjectCard = ({ data }: { data: ProjectData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="card md:flex align-top p-8 md:p-4 mb-4">
        <img
          src={data.mediaUrl || "https://placehold.co/600x400?text=No+Preview"}
          alt={`${data.projectName} cover image`}
          width={600}
          height={400}
          style={{ objectFit: "cover" }}
          className={`md:mr-8 m-auto md:m-0 w-[250px] h-[100%] ring-2 ring-slate-400 rounded-sm ${data.mediaUrl && "cursor-pointer hover:ring-sky-400"}`}
          onClick={() => {
            if (data.mediaUrl) {
              setIsModalOpen(true);
            }
          }}
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{data.projectName}</h3>
          <p className="text-gray-600 mb-4">{data.description}</p>
          <div className="flex flex-wrap gap-2">
            {data.stack.map((tech: string) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={data.mediaUrl || "https://placehold.co/600x400?text=No+Preview"}
            alt={`${data.projectName} cover image`}
            width={600}
            height={400}
            style={{ objectFit: "cover" }}
            className="rounded-sm mx-auto"
          />
        </div>
      )}
    </div>
  );
};

const Projects = ({ data }: { data: ProjectData[] }) => {
  return (
    <div>
      {data.map((project) => (
        <ProjectCard key={project.projectName} data={project} />
      ))}
    </div>
  );
};

export default Projects;
