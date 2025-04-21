"use client";
import { useState, useEffect } from "react";
import { useNotion } from "../notionContext";

interface Skill {
  mastery: number;
  categories: string[];
  skill: string;
  src: string;
}

const SkillGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [exitingSkills, setExitingSkills] = useState<string[]>([]); // Track exiting skills
  const skillset = useNotion().data?.skillset;

  useEffect(() => {
    if (!skillset) return;

    const newFilteredSkills =
      selectedCategory === "All"
        ? skillset
        : skillset.filter(({ categories }) =>
            categories.includes(selectedCategory),
          );

    // Identify skills that are leaving
    const exiting = filteredSkills
      .filter(({ skill }) => !newFilteredSkills.some((s) => s.skill === skill))
      .map((s) => s.skill);

    setExitingSkills(exiting);

    // Delay removing skills from the grid to allow animation to play
    setTimeout(() => {
      setExitingSkills([]);
      setFilteredSkills(newFilteredSkills);
    }, 400);
  }, [selectedCategory]);

  if (!skillset) {
    return <div>No data for skill grid...</div>;
  }

  const categories: string[] = [
    "All",
    ...new Set(skillset.flatMap(({ categories }) => categories)),
  ];

  return (
    <div>
      <div className="block mb-5 mx-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`${selectedCategory === category && "active"}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filteredSkills.map(({ skill, src }) => (
          <div
            key={skill}
            className={`${
              exitingSkills.includes(skill)
                ? "animate-fade-out"
                : "animate-fade-in"
            } transition-all md:flex card py-2 md:py-0`}
          >
            {src && (
              <div className="p-2 object-fill rounded-xl bg-white/70 shadow-sm size-20 flex items-center m-auto md:m-0">
                <img src={src} />
              </div>
            )}
            <p className="my-auto text-center md:text-left text-xs md:text-lg mt-2 md:mt-auto md:ml-4">
              {skill}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillGrid;
