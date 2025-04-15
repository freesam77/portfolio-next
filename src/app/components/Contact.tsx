"use client";
import { Suspense, lazy, ComponentType } from "react";
import { useNotion } from "../notionContext.tsx";
import Tooltip from "./Tooltip.tsx";

interface IconProps {
  iconName: string;
}

type ContactData = {
  OnlinePresence: string;
  Links: string;
  MUIIconsModule: string;
};

const DynamicIcon: React.FC<IconProps> = ({ iconName }) => {
  const IconComponent = lazy(() =>
    import("@mui/icons-material").then((module) => {
      const Icon = module[
        iconName as keyof typeof module
      ] as ComponentType<any>;
      if (Icon) {
        return { default: Icon };
      } else {
        throw new Error(`Icon ${iconName} not found`);
      }
    }),
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IconComponent />
    </Suspense>
  );
};

const NotionDataPreviewer = () => {
  const contactData: ContactData[] = [];

  const { contact } = useNotion().data;

  contact.forEach(({ OnlinePresence, Links, MUIIconsModule }) => {
    contactData.push({
      OnlinePresence,
      Links,
      MUIIconsModule,
    });
  });

  return (
    <div className="border-t-2 border-white h-[100px] mb-10">
      <div className="flex justify-between w-[200px] py-6 mx-auto">
        {contactData.map(({ OnlinePresence, Links, MUIIconsModule }) => (
          <Tooltip
            description={OnlinePresence}
            key={`${OnlinePresence}-${Links}`}
          >
            <a href={Links} key={OnlinePresence}>
              <DynamicIcon iconName={MUIIconsModule} />
            </a>
          </Tooltip>
        ))}
      </div>
      <p className="text-center">
        © Samuel Razali {new Date().getFullYear().toString()}
      </p>
    </div>
  );
};

export default NotionDataPreviewer;
