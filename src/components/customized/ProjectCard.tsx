import { ProjectData } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	LinkIcon,
	ZoomInIcon
} from "lucide-react";
import StackBadge from "./StackBadge"
import Image from "next/image";
import ImageModal from "./ImageModal";
import PerfectScrollbar from "@/components/ui/PerfectScrollbar";


export default function ProjectCard({
	imgsrc,
	projectName,
	description,
	url,
	stack
}: ProjectData) {
	return (
		<Card className="w-full max-w-xs">
			<CardHeader>
				<h3>{projectName}</h3>
			</CardHeader>
			{imgsrc && (
				<ImageModal
					src={imgsrc}
					alt={projectName}
					trigger={
						<div className="relative w-full aspect-video bg-muted border-y overflow-hidden cursor-pointer group">
							<Image
								src={imgsrc}
								alt={projectName}
								fill
								className="object-center cursor-pointer transition-transform group-hover:scale-105"
								priority
							/>
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
								<ZoomInIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={32} />
							</div>
						</div>
					}
				/>
			)}
			<CardContent>
				{stack.length > 0 && (
					<PerfectScrollbar className="pb-4">
						<div className="flex gap-2 w-full">
							{stack.map(st => (
								<StackBadge key={st}>{st}</StackBadge>
							))}
						</div>
					</PerfectScrollbar>
				)}

				<Separator />


				<PerfectScrollbar className="mt-2 pr-2 text-muted-foreground max-h-72">
					<div dangerouslySetInnerHTML={{
						__html: description,
					}}>
					</div>
				</PerfectScrollbar>

			</CardContent>

			{url && (
				<>
					<Separator />
					<CardFooter>
						{/* empty divs to just fill the grid */}
						<div />
						<Button asChild variant="ghost" className="w-full text-muted-foreground">
							<a href={url} target="_blank" rel="noopener noreferrer">
								<LinkIcon />
								<span className="">Link</span>
							</a>
						</Button>
						<div />
					</CardFooter>
				</>
			)}
		</Card>
	);
}

