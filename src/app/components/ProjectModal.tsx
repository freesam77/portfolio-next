"use client";
import Modal from "./Modal";

interface ProjectModalProps {
    mediaUrl?: string;
    projectName: string;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ mediaUrl, projectName, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <img
                className="rounded-sm mx-auto"
                src={mediaUrl || "https://placehold.co/600x400?text=No+Preview"}
                alt={projectName}
            />
        </Modal>
    );
};

export default ProjectModal; 