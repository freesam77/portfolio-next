'use client';

import Image from 'next/image';
import { XIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
  DialogClose,
} from '@/components/ui/dialog';

interface ImageModalProps {
  src: string;
  alt: string;
  trigger: React.ReactNode;
}

export default function ImageModal({ src, alt, trigger }: ImageModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="z-50 bg-black/10 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent 
          className="!max-w-none !max-h-none !w-fit !h-fit p-2 bg-transparent border-0 shadow-none flex flex-col gap-2"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">{alt}</DialogTitle>
            <DialogClose asChild>
              <button 
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 cursor-pointer text-black opacity-100"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </DialogClose>
          </div>
          <div>
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={800}
              quality={95}
              priority
            />
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}