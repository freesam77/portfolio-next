"use client";
import Tooltip from "./Tooltip";
import type { ContactData } from "../types";
import { useState, useEffect } from "react";
import SectionLoading from "./SectionLoading";
import ErrorComponent from "./ErrorComponent";

const Contact = () => {
  const [data, setData] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/notion/contact");
        if (!response.ok) throw new Error("Failed to fetch contact data");
        const result = await response.json();
        setData(result.contact ?? []);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <SectionLoading />;
  if (error) return <ErrorComponent error={error} />;

  return (
    <div className="bg-gradient-to-t from-sky-300/40 to-white/0 backdrop-blur-xs py-8">
      <div className="flex justify-between w-[200px] py-6 mx-auto">
        {data.map(({ OnlinePresence, Links, Icon }) => (
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
