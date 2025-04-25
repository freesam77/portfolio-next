"use client";
import { useNotion } from "../notionContext";
import Tooltip from "./Tooltip";

const Contact = () => {
  return (
    <div className="bg-gradient-to-t from-sky-300/40 to-white/0 backdrop-blur-xs py-8">
      <div className="flex justify-between w-[200px] py-6 mx-auto">
        {useNotion().data?.contact?.map(({ OnlinePresence, Links, Icon }) => (
          <Tooltip
            description={OnlinePresence}
            key={`${OnlinePresence}-${Links}`}
          >
            <a href={Links} key={OnlinePresence}>
              <img
                src={Icon || "https://placehold.co/600x400?text=No+Preview"}
                alt={OnlinePresence}
                width="40"
              />
            </a>
          </Tooltip>
        ))}
      </div>
      <h3 className="text-center">
        © Samuel Razali {new Date().getFullYear().toString()}
      </h3>
    </div>
  );
};

export default Contact;
