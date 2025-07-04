'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Card } from "../ui/card"

interface LikeData {
	id: string;
	likes: string;
	tagline?: string;
	icon?: string;
	hidden?: boolean;
}

interface LikesProps {
	delay?: number;
	likes?: LikeData[];
}

const Likes: React.FC<LikesProps> = ({ delay = 3000, likes = [] }) => {
	const [currentIndex, setCurrentIndex] = React.useState(0);
	const [displayText, setDisplayText] = React.useState({ title: '', tagline: '' });
	const [showCursor, setShowCursor] = React.useState(true);
	const [activeLine, setActiveLine] = React.useState<'title' | 'tagline'>('title');
	const timeoutRef = useRef<NodeJS.Timeout>(null);

	// Filter out empty items
	const items = useMemo(() => likes.filter((item) => item.likes.trim() !== ''), [likes]);

	useEffect(() => {
		if (items.length === 0) return;

		const currentItem = items[currentIndex % items.length];
		if (!currentItem) return;

		let titleIndex = -1;
		let taglineIndex = -1;

		setDisplayText({ title: '', tagline: '' });
		setActiveLine('title');

		const typeTitle = () => {
			if (titleIndex < currentItem.likes.length - 1) {
				setDisplayText((prev) => ({
					...prev,
					title: prev.title + currentItem.likes[titleIndex],
				}));
				titleIndex++;
				timeoutRef.current = setTimeout(typeTitle, 50 + Math.random() * 50);
			} else {
				if (currentItem.tagline) {
					setActiveLine('tagline');
					timeoutRef.current = setTimeout(typeTagline, 300);
				} else {
					completeTyping();
				}
			}
		};

		const typeTagline = () => {
			if (taglineIndex < (currentItem.tagline?.length ?? 0) - 1) {
				setDisplayText((prev) => ({
					...prev,
					tagline: prev.tagline + (currentItem.tagline?.[taglineIndex] ?? ''),
				}));
				taglineIndex++;
				timeoutRef.current = setTimeout(typeTagline, 30 + Math.random() * 50);
			} else {
				completeTyping();
			}
		};

		const completeTyping = () => {
			// Move to next item after delay
			timeoutRef.current = setTimeout(() => {
				setCurrentIndex((prev) => (prev + 1) % items.length);
			}, delay) as unknown as NodeJS.Timeout;
		};

		typeTitle();

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [currentIndex, delay, items]);

	// Blink cursor effect - always running
	useEffect(() => {
		const interval = setInterval(() => {
			setShowCursor((prev) => !prev);
		}, 500);
		return () => clearInterval(interval);
	}, []);

	if (items.length === 0) {
		return <div>No data available</div>;
	}

	return (
		<Card className="font-mono bg-gray-900/60 text-gray-100 p-5 rounded-lg max-w-2xl w-[90%] min-h-[200px] backdrop-blur">
			<span className="text-sky-300 text-md font-bold mb-2">
				<span dangerouslySetInnerHTML={{
					__html: displayText.title,
				}} />
				{activeLine === 'title' && (
					<span
						className={`inline-block w-2 h-6 bg-gray-100 align-middle ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
					/>
				)}
			</span>

			{displayText.tagline && (
				<span className="text-gray-300 text-sm mb-4">
					<span dangerouslySetInnerHTML={{
						__html: displayText.tagline,
					}} />
					{activeLine === 'tagline' && (
						<span
							className={`inline-block w-2 h-4 bg-gray-100 align-middle ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
						/>
					)}
				</span>
			)}
		</Card>
	);
};

export default Likes;
