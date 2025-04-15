"use client";
import { useNotion } from "../notionContext";
import Tooltip from "./Tooltip";

const Contact = () => {
  return (
    <div className="border-t-2 border-white h-[100px] mb-10">
      <div className="flex justify-between w-[200px] py-6 mx-auto">
        {useNotion().data?.contact?.map(
          ({ OnlinePresence, Links, Icon }) => (
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
          ),
        )}
      </div>
      <p className="text-center">
        © Samuel Razali {new Date().getFullYear().toString()}
      </p>
    </div>
  );
};

export default Contact;
