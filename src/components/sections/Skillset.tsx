'use client';
import { useMemo, useState, useEffect } from 'react';
import FancyMultiSelect, { SelectOption } from "@/components/customized/select/select-12";
import { Card, CardContent } from '../ui/card';

interface SkillData {
	id: string;
	name: string;
	skill: string;
	categories?: string[];
	hidden?: boolean;
}

interface SkillsetProps {
	skillset?: SkillData[];
}

const Skillset: React.FC<SkillsetProps> = ({ skillset = [] }) => {
	const [selectedCategories, setSelectedCategories] = useState<SelectOption[]>([]);
	const [exitingSkills, setExitingSkills] = useState<string[]>([]);

	const skillsetData = skillset;

	// Build unique category list, excluding "Softskills"
	const categories: string[] = useMemo(() => {
		const cats = skillsetData
			.flatMap(({ categories }) => categories || [])
			.filter((cat) => cat && cat.toLowerCase() !== 'softskills');
		return ['All', ...Array.from(new Set(cats))];
	}, [skillsetData]);

	// Filter skills by selected categories, always excluding "Softskills"
	const filteredSkills = useMemo(() => {
		if (
			selectedCategories.length === 0 ||
			selectedCategories.some((cat) => cat.value === 'All')
		) {
			return skillsetData.filter(
				(item) =>
					!item.hidden &&
					!(item.categories || []).some((cat) => cat.toLowerCase() === 'softskills')
			);
		}
		return skillsetData.filter(
			(item) =>
				!item.hidden &&
				!(item.categories || []).some((cat) => cat.toLowerCase() === 'softskills') &&
				(item.categories || []).some((cat) =>
					selectedCategories.some((sel) => sel.value === cat)
				)
		);
	}, [skillsetData, selectedCategories]);

	useEffect(() => {
		// Identify skills that are leaving
		const exiting = skillsetData
			.filter(
				({ categories, skill }) =>
					!(categories || []).some((cat) => cat.toLowerCase() === 'softskills') &&
					!filteredSkills.some((s) => s.skill === skill),
			)
			.map((s) => s.skill);

		// Only update if different
		setExitingSkills((prev) => {
			const isSame = prev.length === exiting.length && prev.every((v, i) => v === exiting[i]);
			return isSame ? prev : exiting;
		});

		// Delay removing skills from the grid to allow animation to play
		const timeout = setTimeout(() => {
			setExitingSkills([]);
		}, 400);
		return () => clearTimeout(timeout);
	}, [skillsetData, filteredSkills]);

	return (
		<>
			<div className="block mb-4">
				<FancyMultiSelect
					options={categories.map((cat) => ({ value: cat, label: cat }))}
					value={selectedCategories}
					onChange={setSelectedCategories}
					placeholder="Select categories..."
				/>
			</div>

			<div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
				{filteredSkills.map((item) => {
					// @ts-expect-error: src exists on runtime data
					const src = typeof item.src === 'string' ? item.src : '';
					const skill = item.skill;
					return (
						<Card
							key={skill}
							className={`bg-gray-900/60 backdrop-blur transition-all ${exitingSkills.includes(skill) ? 'animate-fade-out' : 'animate-fade-in'}`}
						>
							<CardContent className="flex items-center p-0 ">
								{src && (
									<div className="p-2 rounded-xl bg-white/80 size-20 flex items-center justify-center">
										<img src={src} alt={skill} className="max-h-12 max-w-12 object-contain" />
									</div>
								)}
								<p className="ml-4 sm:text-md">{skill}</p>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</ >
	);
};

export default Skillset;
