"use client";
import Tooltip from "./Tooltip";
import { useEffect, useReducer } from "react";
import SectionLoading from "./SectionLoading";
import ErrorComponent from "./ErrorComponent";
import { notionReducer, initialState } from "../context/notionReducer";

const Contact = () => {
  const [state, dispatch] = useReducer(notionReducer, initialState);

  useEffect(() => {
    dispatch({ type: "FETCH_START" });
    const fetchData = async () => {
      try {
        const response = await fetch("/api/notion/contact");
        if (!response.ok) throw new Error("Failed to fetch contact data");
        const result = await response.json();
        dispatch({ type: "FETCH_SUCCESS", payload: { contact: result.contact } });
      } catch (err: unknown) {
        if (err instanceof Error) dispatch({ type: "FETCH_ERROR", error: err.message });
        else dispatch({ type: "FETCH_ERROR", error: "Unknown error" });
      }
    };
    fetchData();
  }, []);

  if (state.loading) return <SectionLoading />;
  if (state.error) return <ErrorComponent error={state.error} />;

  return (
    <div className="bg-gradient-to-t from-sky-300/40 to-white/0 backdrop-blur-xs py-8">
      <div className="flex justify-between w-[200px] py-6 mx-auto">
        {(state.data?.contact ?? []).map(({ OnlinePresence, Links, Icon }) => (
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
