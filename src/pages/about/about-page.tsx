import { APP_INFO } from "@/constants/app-info";
import { CHANGELOG_DATA } from "@/data/changelog";
import { Link } from "react-router-dom";

export function AboutPage() {
	return (
		<div className="mx-auto flex w-full max-w-2xl animate-in flex-col gap-10 py-8 duration-500 fade-in slide-in-from-bottom-4">
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
					<div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5">
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

			<section className="mt-8 flex flex-col items-center gap-4 border-t border-border pt-8 sm:items-start">
				<p className="text-sm text-muted-foreground">Version {CHANGELOG_DATA[0].version}</p>
				<div className="flex gap-4">
					<Link
						to="/"
						className="text-sm font-medium text-primary underline-offset-4 hover:underline"
					>
						Go to your corner &rarr;
					</Link>
					<Link
						to="/updates"
						className="text-sm font-medium text-primary underline-offset-4 hover:underline"
					>
						See what's new &rarr;
					</Link>
				</div>
			</section>
		</div>
	);
}
