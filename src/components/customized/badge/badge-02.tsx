import { Badge } from '@/components/ui/badge';
import React, { ReactNode } from 'react';

interface BadgeSecondaryDemoProps {
	children: ReactNode;
}

const StackBadge: React.FC<BadgeSecondaryDemoProps> = ({ children }) => {
	return (
		<Badge className="rounded-full border-none bg-gradient-to-r from-sky-500 to-indigo-600 text-white">
			{children}
		</Badge>
	);
};

export default StackBadge;
