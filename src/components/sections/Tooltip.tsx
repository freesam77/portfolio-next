'use client';
type TooltipProps = {
	description: string;
	children: React.ReactElement;
};

const Tooltip = ({ description, children }: TooltipProps) => {
	return (
		<div className="relative flex items-center justify-center group">
			{children}
			<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
				{description}
				<div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
			</div>
		</div>
	);
};

export default Tooltip;
