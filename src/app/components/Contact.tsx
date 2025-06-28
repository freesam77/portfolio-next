"use client";
import Tooltip from "./Tooltip";
import { usePortfolio } from "../context/PortfolioContext";

const Contact = () => {
  const { data } = usePortfolio();
  const contactData = data?.contact ?? [];

  return (
    <div className="bg-gradient-to-t from-sky-300/40 to-white/0 backdrop-blur-xs py-8">
      <div className="flex justify-between w-[200px] py-6 mx-auto">
        {contactData
          .filter(({ OnlinePresence }) => OnlinePresence !== "Resume")
          .map(({ OnlinePresence, Links, Icon }) => (
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