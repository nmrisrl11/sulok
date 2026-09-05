import { APP_INFO } from "@/constants/app-info";
import { CHANGELOG_DATA } from "@/data/changelog";
import { Link } from "react-router-dom";

export function AboutPage() {
	return (
		<div className="flex flex-col gap-10 w-full max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<section className="flex flex-col gap-4 text-center sm:text-left w-full">
				<h1
					className="font-sans text-4xl font-extrabold italic"
					style={{ fontVariationSettings: "'WONK' 0, 'SOFT' 0" }}
				>
					{APP_INFO.name}
				</h1>
				<p className="text-xl font-medium text-foreground">{APP_INFO.tagline}</p>
			</section>

			<div className="h-px bg-border w-full" />

			<section className="flex flex-col gap-8">
				<div className="flex flex-col gap-3">
					<h2 className="text-lg font-bold font-sans">What does "Sulok" mean?</h2>
					<div className="bg-card border border-border p-5 rounded-lg flex flex-col gap-2">
						<p className="text-foreground">
							<strong>{APP_INFO.name}</strong>{" "}
							<span className="text-muted-foreground">{APP_INFO.pronunciation}</span>
						</p>
						<p className="text-muted-foreground">{APP_INFO.meaning}</p>
						<p className="text-sm italic mt-2 text-muted-foreground">
							e.g., "sa sulok" (in the corner) or "sulok ko" (my corner).
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<h2 className="text-lg font-bold font-sans">About the product</h2>
					<p className="text-muted-foreground leading-relaxed">{APP_INFO.shortDescription}</p>
					<p className="text-muted-foreground leading-relaxed">
						It's designed to be a quiet, local-first space where you can safely store references,
						articles, tools, and anything else worth keeping. No ads, no tracking, just your digital
						corner.
					</p>
				</div>
			</section>

			<section className="flex flex-col items-center sm:items-start gap-4 mt-8 pt-8 border-t border-border">
				<p className="text-sm text-muted-foreground">Version {CHANGELOG_DATA[0].version}</p>
				<div className="flex gap-4">
					<Link
						to="/"
						className="text-primary hover:underline underline-offset-4 text-sm font-medium"
					>
						Go to your corner &rarr;
					</Link>
					<Link
						to="/updates"
						className="text-primary hover:underline underline-offset-4 text-sm font-medium"
					>
						See what's new &rarr;
					</Link>
				</div>
			</section>
		</div>
	);
}
