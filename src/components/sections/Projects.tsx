'use client';
import ProjectCard from '../customized/ProjectCard';

export interface ProjectData {
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

	return (
		<>
			<div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center'>
				{sortedProjects.map((project: ProjectData) => {
					if (project.hidden) return null;
					return (
						<ProjectCard
							key={`${project.id}-${project.projectName}`}
							projectName={project.projectName}
							description={project.description}
							mediaUrl={project.mediaUrl ?? ''}
							url={project.url ?? ''}
							stack={project.stack}
							client={''}
							hidden={false}
							order={0}
						/>
					);
				})}
			</div>
		</>
	);
};

export default Projects;
