"use client";

import { X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useCallback, useMemo } from "react";

export type SelectOption = { value: string; label: string };

interface FancyMultiSelectProps {
	options: SelectOption[];
	value: SelectOption[];
	onChange: (options: SelectOption[]) => void;
	placeholder?: string;
}

export default function MultiSelect({
	options,
	value,
	onChange,
	placeholder = "Select...",
}: FancyMultiSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");

	const selected = value || [];

	const handleUnselect = useCallback((option: SelectOption) => {
		onChange(selected.filter((s) => s.value !== option.value));
	}, [onChange, selected]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Backspace" && selected.length > 0 && inputValue === "") {
				onChange(selected.slice(0, -1));
			}
		},
		[selected, onChange, inputValue]
	);

	const filteredOptions = useMemo(
		() => options.filter((option) => !selected.some((s) => s.value === option.value) && option.label.toLowerCase().includes(inputValue.toLowerCase())),
		[options, selected, inputValue]
	);

	return (
		<div className="w-full">
			<Command className="overflow-visible">
				<div className="rounded-lg border border-input px-3 py-4 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
					<div className="flex flex-wrap gap-1">
						{selected.map((option) => {
							return (
								<Badge
									key={option.value}
									variant="secondary"
									className="cursor-pointer"
									onClick={() => handleUnselect(option)}
								>
									{option.label}
									<X
										className="size-3 text-muted-foreground hover:text-foreground ml-2 cursor-pointer"
									/>
								</Badge>
							);
						})}
						<CommandPrimitive.Input
							onKeyDown={handleKeyDown}
							onValueChange={setInputValue}
							value={inputValue}
							onBlur={() => setOpen(false)}
							onFocus={() => setOpen(true)}
							placeholder={placeholder}
							className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
						/>
					</div>
					<div className="relative">
						<CommandList>
							{open && !!filteredOptions.length && (
								<div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
									<CommandGroup className="h-full overflow-auto">
										{filteredOptions.map((option) => {
											return (
												<CommandItem
													key={option.value}
													onMouseDown={(e) => {
														e.preventDefault();
													}}
													onSelect={() => {
														setInputValue("");
														onChange([...selected, option]);
													}}
													className={"cursor-pointer"}
												>
													{option.label}
												</CommandItem>
											);
										})}
									</CommandGroup>
								</div>
							)}
						</CommandList>
					</div>
				</div>

			</Command>
		</div>
	);
}
