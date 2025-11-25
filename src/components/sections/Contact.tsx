'use client';
import Tooltip from './Tooltip';
import Image from 'next/image';

interface ContactData {
	id: string;
	OnlinePresence: string;
	Links: string;
	imgsrc?: string;
}

interface ContactProps {
	contact?: ContactData[];
}

const Contact: React.FC<ContactProps> = ({ contact = [] }) => {
	return (
		<div className="bg-gradient-to-t from-sky-300/40 to-white/0 backdrop-blur-xs py-10 pb-30 md:pb-10">
			<div className="flex gap-2 justify-between w-[200px] py-6 mx-auto">
				{contact
					.map(({ OnlinePresence, Links, imgsrc }) => (
						<Tooltip description={OnlinePresence} key={`${OnlinePresence}-${Links}`}>
							<a href={Links} key={OnlinePresence}>
								<Image
									src={imgsrc || 'https://placehold.co/600x400?text=No+Preview'}
									alt={OnlinePresence}
									width="40"
									height="40"
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
