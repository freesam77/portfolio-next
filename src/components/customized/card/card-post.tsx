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
	LinkIcon
} from "lucide-react";
import StackBadge from "../badge/badge-02"
import Image from "next/image";


export default function CardPost({
	mediaUrl,
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
			{mediaUrl && (
				<div className="relative w-full aspect-video bg-muted border-y overflow-hidden">
					<Image
						src={mediaUrl}
						alt={projectName}
						fill
						className="object-center"
						priority
					/>
				</div>
			)}
			<CardContent>
				{stack.length > 0 && (
					<div className="flex flex-wrap gap-2 w-[100%] mb-4">
						{stack.map(st => (
							<StackBadge key={st}>{st}</StackBadge>
						))}
					</div>
				)}

				<Separator />


				<div className="mt-2 text-muted-foreground" dangerouslySetInnerHTML={{
					__html: description,
				}}>
				</div>

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

