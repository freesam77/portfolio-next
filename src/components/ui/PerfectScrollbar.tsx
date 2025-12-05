'use client';

import { useEffect, useRef } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

interface PerfectScrollbarProps {
	children: React.ReactNode;
	className?: string;
	options?: Record<string, unknown>;
}

export default function PerfectScrollbarComponent({
	children,
	className = '',
	options = {},
}: PerfectScrollbarProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const ps = new PerfectScrollbar(container, {
            swipeEasing: true,
			...options,
		});

		return () => {
			ps.destroy();
		};
	}, [options]);

	return (
		<div ref={containerRef} className={className} style={{ position: 'relative' }}>
			{children}
		</div>
	);
}