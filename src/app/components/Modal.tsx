"use client";
import { ReactElement, useEffect } from "react";
import { Close } from "@mui/icons-material";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactElement;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  // Lock scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    isOpen && (
      <div
        className="fixed inset-0 z-50 flex justify-center bg-gray-600/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="w-full top-0 h-[120px] fixed p-6 bg-gradient-to-b from-slate-900 to-transparent">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-slate-200 hover:text-slate-500"
            >
              <Close />
            </button>
          </div>
        </div>
        <div className="m-auto rounded-lg shadow-lg bg-slate-300 p-1 w-[80%]">
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
