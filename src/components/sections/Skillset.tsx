'use client';
import { useMemo, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import { processImgurImageUrl } from '@/lib/imgurUrl';

interface SkillData {
	id?: string;
	name?: string | null;
	/** Notion may use different casing; see primarySkillLabel */
	skill?: string;
	categories?: string[];
	hidden?: boolean;
	imgsrc?: string | null;
	/** Notion skill DB often uses `icon`; `imgsrc` is supported too */
	icon?: string | null;
}

function hasPresentText(value: unknown): boolean {
	if (value == null) return false;
	if (typeof value !== 'string') return false;
	return value.trim().length > 0;
}

function asRow(item: SkillData): Record<string, unknown> {
	return item as unknown as Record<string, unknown>;
}

/** Label shown in the card: first non-empty among common Notion property names. */
function primarySkillLabel(item: SkillData): string {
	const o = asRow(item);
	for (const key of ['skill', 'Skill', 'name', 'Name'] as const) {
		const v = o[key];
		if (typeof v === 'string' && v.trim().length > 0) return v.trim();
	}
	return '';
}

/** File / URL for the icon: Notion property names vary by casing. */
function skillImageSource(item: SkillData): string {
	const o = asRow(item);
	for (const key of ['imgsrc', 'icon', 'Icon', 'image', 'Image'] as const) {
		const v = o[key];
		if (typeof v === 'string' && v.trim().length > 0) return v.trim();
	}
	return '';
}

/** Row must be showable: has a text label and an image URL (original intent: skip null name/icon). */
function isRenderableSkill(item: SkillData): boolean {
	return hasPresentText(primarySkillLabel(item)) && hasPresentText(skillImageSource(item));
}

interface SkillsetProps {
	skillset?: SkillData[];
}

const scrollbarHiddenClass =
	'[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

const Skillset: React.FC<SkillsetProps> = ({ skillset = [] }) => {
	/** Which category labels are active; empty = same as "All" (any category). */
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
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

	// Build unique category list, excluding "Softskills" (only from rows we would show)
	const categories: string[] = useMemo(() => {
		const cats = skillsetData
			.filter(isRenderableSkill)
			.flatMap(({ categories }) => categories || [])
			.filter((cat) => {
				const label = String(cat ?? '').trim();
				return label.length > 0 && label.toLowerCase() !== 'softskills';
			});
		return ['All', ...Array.from(new Set(cats))];
	}, [skillsetData]);

	// Filter skills by selected category and search term, always excluding "Softskills"
	const filteredSkills = useMemo(() => {
		return skillsetData.filter(
			(item) => {
				if (!isRenderableSkill(item)) return false;

				const itemCategories = item.categories || [];
				const o = asRow(item);
				const label = primarySkillLabel(item);
				const nameText = [item.name, o['name'], o['Name']]
					.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
					.map((s) => s.toLowerCase())
					.join(' ');
				const normalizedSearch = searchTerm.trim().toLowerCase();
				const matchesCategory =
					selectedCategories.length === 0 ||
					itemCategories.some((cat) => selectedCategories.includes(String(cat ?? '')));
				const skillText = label.toLowerCase();
				const matchesSearch =
					normalizedSearch.length === 0 ||
					skillText.includes(normalizedSearch) ||
					(nameText.length > 0 && nameText.includes(normalizedSearch)) ||
					itemCategories.some((cat) =>
						String(cat ?? '').toLowerCase().includes(normalizedSearch),
					);

				return (
					!item.hidden &&
					!itemCategories.some((cat) => String(cat ?? '').toLowerCase() === 'softskills') &&
					matchesCategory &&
					matchesSearch
				);
			}
		);
	}, [skillsetData, selectedCategories, searchTerm]);

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
			.filter(isRenderableSkill)
			.filter(
				(item) =>
					!(item.categories || []).some((cat) => String(cat ?? '').toLowerCase() === 'softskills') &&
					!filteredSkills.some(
						(s) => primarySkillLabel(s) === primarySkillLabel(item as SkillData),
					),
			)
			.map((s) => primarySkillLabel(s as SkillData));

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

	const toggleCategory = (category: string) => {
		if (category === 'All') {
			setSelectedCategories([]);
			return;
		}
		setSelectedCategories((prev) =>
			prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
		);
	};

	const isCategorySelected = (category: string) =>
		category === 'All' ? selectedCategories.length === 0 : selectedCategories.includes(category);

	return (
		<>
			<div>
				<input
					type="text"
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					placeholder="Search skills..."
					className="w-full rounded-lg border border-white/20 bg-gray-900/60 px-3 py-2 text-sm text-white placeholder:text-white/60 outline-none focus:border-sky-300"
				/>
				<div className="mt-8 space-y-2">
					<p className="text-sm font-medium text-white/80">Categories</p>
					<div className={`overflow-x-auto pb-1 ${scrollbarHiddenClass}`}>
						<div className="flex w-max min-w-full gap-2">
							{categories.map((category) => {
								const selected = isCategorySelected(category);
								return (
									<button
										key={category}
										type="button"
										aria-pressed={selected}
										onClick={() => toggleCategory(category)}
										className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors cursor-pointer ${
											selected
												? 'bg-gray-600 text-white border-gray-500'
												: 'bg-gray-900/60 backdrop-blur hover:border-sky-300'
										}`}
									>
										{category}
									</button>
								);
							})}
						</div>
					</div>
				</div>
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
					{paginatedSkills.map((item, index) => {
						const imgsrcRaw = skillImageSource(item);
						const imgsrc = imgsrcRaw ? processImgurImageUrl(imgsrcRaw) : '';
						const skill = primarySkillLabel(item);
						return (
							<Card
								key={item.id != null && String(item.id).length > 0 ? String(item.id) : `skill-${index}-${skill}`}
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
