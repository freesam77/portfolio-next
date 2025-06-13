"use client";
import { useState, useEffect, useMemo } from "react";
import type { SkillsetData } from "../types";

const Skillset = ({ data }: { data: SkillsetData[] }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [exitingSkills, setExitingSkills] = useState<string[]>([]);

    // Build unique category list, excluding "Softskills"
    const categories: string[] = useMemo(() => {
        const cats = data
            .flatMap(({ categories }) => categories || [])
            .filter((cat) => cat && cat.toLowerCase() !== "softskills");
        return ["All", ...Array.from(new Set(cats))];
    }, [data]);

    // Filter skills by selected category, always excluding "Softskills"
    const filteredSkills = useMemo(() => {
        return data.filter(
            (item) => !item.hidden &&
                !(item.categories || []).some((cat) => cat.toLowerCase() === "softskills") &&
                (selectedCategory === "All" ||
                    (item.categories || []).includes(selectedCategory))
        );
    }, [data, selectedCategory]);

    useEffect(() => {
        // Identify skills that are leaving
        const exiting = data
            .filter(({ categories, skill }) =>
                !(categories || []).some((cat) => cat.toLowerCase() === "softskills") &&
                !filteredSkills.some((s) => s.skill === skill)
            )
            .map((s) => s.skill);

        setExitingSkills(exiting);

        // Delay removing skills from the grid to allow animation to play
        const timeout = setTimeout(() => {
            setExitingSkills([]);
        }, 400);
        return () => clearTimeout(timeout);
    }, [data, filteredSkills]);

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
                {filteredSkills.map((item) => {
                    // @ts-expect-error: src exists on runtime data
                    const src = typeof item.src === 'string' ? item.src : '';
                    const skill = item.skill;
                    return (
                        <div
                            key={skill}
                            className={
                                exitingSkills.includes(skill)
                                    ? "animate-fade-out transition-all md:flex card py-2 md:py-0"
                                    : "animate-fade-in transition-all md:flex card py-2 md:py-0"
                            }
                        >
                            {src && (
                                <div className="p-2 object-fill rounded-xl bg-white/70 shadow-sm size-20 flex items-center m-auto md:m-0">
                                    <img src={src} alt={skill} />
                                </div>
                            )}
                            <p className="my-auto text-center md:text-left text-xs md:text-lg mt-2 md:mt-auto md:ml-4">
                                {skill}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Skillset;
