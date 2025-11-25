import { Badge } from '@/components/ui/badge';
import React, { ReactNode } from 'react';

interface BadgeSecondaryDemoProps {
	children: ReactNode;
}

const StackBadge: React.FC<BadgeSecondaryDemoProps> = ({ children }) => {
	return (
		<div className="bg-gradient-to-r from-sky-400 to-indigo-600 rounded-sm p-[2px] flex items-center justify-center">
			<Badge className="bg-background hover:bg-background text-foreground rounded-sm border-none">
				{children}
			</Badge>
		</div>
	);
};

export default StackBadge;
