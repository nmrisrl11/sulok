import { NomiBot } from "@/components/nomi-bot";
import { SEO } from "@/components/seo";
import { APP_INFO } from "@/constants/app-info";
import { CHANGELOG_DATA } from "@/data/changelog";
import { useState } from "react";

export function AboutPage() {
	const [isBotHovered, setIsBotHovered] = useState(false);

	return (
		<div className="mx-auto flex w-full max-w-2xl animate-in flex-col gap-10 px-4 pt-6 duration-500 fade-in slide-in-from-bottom-4 md:px-6 md:pt-12">
			<SEO title="About" canonical="/about" />
			<section className="flex w-full flex-col gap-4 text-center sm:text-left">
				<h1
					className="font-heading text-4xl font-extrabold italic"
					style={{ fontVariationSettings: "'WONK' 0, 'SOFT' 0" }}
				>
					{APP_INFO.name}
				</h1>
				<p className="text-xl font-medium text-foreground">{APP_INFO.tagline}</p>
			</section>

			<div className="h-px w-full bg-border" />

			<section className="flex flex-col gap-8">
				<div className="flex flex-col gap-3">
					<h2 className="font-heading text-lg font-bold">What does "{APP_INFO.name}" mean?</h2>
					<div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5 supports-[corner-shape:squircle]:rounded-4xl supports-[corner-shape:squircle]:corner-squircle">
						<p className="text-foreground">
							<strong>{APP_INFO.name}</strong>{" "}
							<span className="text-muted-foreground">{APP_INFO.pronunciation}</span>
						</p>
						<p className="text-muted-foreground">{APP_INFO.meaning}</p>
						<p className="mt-2 text-sm text-muted-foreground italic">
							e.g., "sa sulok" (in the corner) or "sulok ko" (my corner).
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<h2 className="font-heading text-lg font-bold">About the product</h2>
					<p className="leading-relaxed text-muted-foreground">{APP_INFO.shortDescription}</p>
					<p className="leading-relaxed text-muted-foreground">
						It's designed to be a quiet, local-first space where you can safely store references,
						articles, tools, and anything else worth keeping. No ads, no tracking, just your digital
						corner.
					</p>
				</div>
			</section>

			<section className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
				<p>Version {CHANGELOG_DATA[0].version}</p>
				<span className="flex items-center">
					Developed by:
					<a
						href="https://www.nmrisrl.dev/"
						target="_blank"
						rel="noopener noreferrer"
						title="Visit Developer's Website"
						onMouseEnter={() => setIsBotHovered(true)}
						onMouseLeave={() => setIsBotHovered(false)}
						className="group ml-1 flex items-center font-medium transition-colors hover:text-foreground"
					>
						Nomer with{" "}
						<NomiBot
							isHovered={isBotHovered}
							className="ml-1 h-5 w-5"
							showBody={false}
							headBounce={false}
							eyeAnimation="look-left"
						/>
					</a>
				</span>
			</section>
		</div>
	);
}
