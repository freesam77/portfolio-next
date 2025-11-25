'use client';
import { useMemo, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import MultiSelect, { SelectOption } from "@/components/customized/MultiSelect";
import { Card, CardContent } from '../ui/card';

interface SkillData {
	id: string;
	name: string;
	skill: string;
	categories?: string[];
	hidden?: boolean;
	imgsrc?: string;
}

interface SkillsetProps {
	skillset?: SkillData[];
}

const Skillset: React.FC<SkillsetProps> = ({ skillset = [] }) => {
	const [selectedCategories, setSelectedCategories] = useState<SelectOption[]>([]);
	const [exitingSkills, setExitingSkills] = useState<string[]>([]);
	const gridRef = useRef<HTMLDivElement>(null);
	const [lockedHeight, setLockedHeight] = useState<number | undefined>(undefined);
	const skillsetData = skillset;
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(12); // Responsive page size

	// Responsive PAGE_SIZE effect
	useEffect(() => {
		function handleResize() {
			if (window.innerWidth < 768) { // Tailwind md breakpoint is 768px
				setPageSize(6);
			} else {
				setPageSize(12);
			}
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (gridRef.current && lockedHeight === undefined) {
			setLockedHeight(gridRef.current.offsetHeight);
		}
	}, [lockedHeight]);

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

	// Calculate total pages
	const totalPages = Math.ceil(filteredSkills.length / pageSize);

	// Paginated skills for current page
	const paginatedSkills = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredSkills.slice(start, start + pageSize);
	}, [filteredSkills, currentPage, pageSize]);

	// Reset to first page when filter changes or pageSize changes
	useEffect(() => {
		setCurrentPage(1);
	}, [filteredSkills, pageSize]);

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
			<div className="block">
				<MultiSelect
					options={categories.map((cat) => ({ value: cat, label: cat }))}
					value={selectedCategories}
					onChange={setSelectedCategories}
					placeholder="Select categories..."
				/>
			</div>
			<div ref={gridRef} style={lockedHeight ? { height: lockedHeight } : undefined}>
				{/* Pagination controls */}
				<div className="flex justify-center items-center gap-2 my-4 h-[32px]">
					{totalPages > 1 && (
						Array.from({ length: totalPages }, (_, i) => (
							<button
								key={i + 1}
								className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm transition-colors cursor-pointer
								${currentPage === i + 1 ? 'bg-gray-600 text-white' : 'bg-gray-900/60 backdrop-blur hover:border-sky-300'}`}
								onClick={() => setCurrentPage(i + 1)}
							>
								{i + 1}
							</button>
						))
					)}
				</div>
				<div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
					{paginatedSkills.map((item) => {
						// @ts-expect-error: imgsrc exists on runtime data
						const imgsrc = typeof item.imgsrc === 'string' ? item.imgsrc : '';
						const skill = item.skill;
						return (
							<Card
								key={skill}
								className={`bg-gray-900/60 backdrop-blur transition-all ${exitingSkills.includes(skill) ? 'animate-fade-out' : 'animate-fade-in'}`}
							>
								<CardContent className="flex items-center p-0 ">
									{imgsrc && (
										<div className="p-2 rounded-xl bg-white/80 size-20 flex items-center justify-center">
											<Image src={imgsrc} alt={skill} className="max-h-12 max-w-12 object-contain" width={50} height={50} />
										</div>
									)}
									<p className="ml-4 sm:text-md">{skill}</p>
								</CardContent>
							</Card>
						);
					})}
				</div>

			</div>
		</ >
	);
};

export default Skillset;
