'use client';
import Tooltip from './Tooltip';

interface ContactData {
	id: string;
	OnlinePresence: string;
	Links: string;
	Icon?: string;
}

interface ContactProps {
	contact?: ContactData[];
}

const Contact: React.FC<ContactProps> = ({ contact = [] }) => {
	return (
		<div className="bg-gradient-to-t from-sky-300/40 to-white/0 backdrop-blur-xs py-10 pb-20 md:pb-10">
			<div className="flex gap-2 justify-between w-[200px] py-6 mx-auto">
				{contact
					.map(({ OnlinePresence, Links, Icon }) => (
						<Tooltip description={OnlinePresence} key={`${OnlinePresence}-${Links}`}>
							<a href={Links} key={OnlinePresence}>
								<img
									src={Icon || 'https://placehold.co/600x400?text=No+Preview'}
									alt={OnlinePresence}
									width="40"
								/>
							</a>
						</Tooltip>
					))}
			</div>
			<h3 className="text-center">© Samuel Razali {new Date().getFullYear().toString()}</h3>
		</div>
	);
};

export default Contact;
