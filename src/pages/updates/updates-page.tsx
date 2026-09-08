import { APP_INFO } from "@/constants/app-info";
import { CHANGELOG_DATA } from "@/data/changelog";

export function UpdatesPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl animate-in flex-col gap-12 py-8 pb-24 duration-500 fade-in slide-in-from-bottom-4">
			{/* Header Section */}
			<section className="flex w-full flex-col items-center gap-3 text-center sm:items-start sm:text-left">
				<h1
					className="font-heading text-4xl font-extrabold italic sm:text-5xl"
					style={{ fontVariationSettings: "'WONK' 0, 'SOFT' 0" }}
				>
					Updates
				</h1>
				<p className="text-lg font-medium text-muted-foreground">What's new in {APP_INFO.name}</p>
				<span className="mt-1 rounded-full bg-muted px-3 py-1 font-mono text-sm font-medium text-foreground">
					v{CHANGELOG_DATA[0].version}
				</span>
			</section>

			<div className="h-px w-full bg-border" />

			{/* Changelog Entries */}
			<div className="flex w-full flex-col gap-16">
				{CHANGELOG_DATA.map((release) => (
					<div key={release.version} className="flex w-full flex-col gap-8 md:flex-row md:gap-12">
						{/* Left Column: Version & Date */}
						<div className="flex shrink-0 flex-col gap-1 md:w-1/4">
							<div className="sticky top-20">
								<h2 className="font-mono text-xl font-bold text-primary">{release.version}</h2>
								<p className="text-sm font-medium text-muted-foreground">{release.date}</p>
							</div>
						</div>

						{/* Right Column: Changes */}
						<div className="flex flex-col gap-10 md:w-3/4">
							{release.title && (
								<h3 className="font-heading text-2xl font-bold">{release.title}</h3>
							)}

							<div className="flex flex-col gap-10">
								{release.changes.map((changeGroup) => (
									<div key={changeGroup.category} className="flex flex-col gap-4">
										<h4 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
											{changeGroup.category}
										</h4>
										<ul className="flex flex-col gap-2.5">
											{changeGroup.items.map((item, i) => {
												// Bold the feature name before the colon
												const [title, ...rest] = item.split(":");
												const hasColon = rest.length > 0;

												return (
													<li
														key={i}
														className="flex gap-2.5 text-sm leading-snug text-foreground/80"
													>
														<span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-foreground/30 text-border select-none" />
														<span>
															{hasColon ? (
																<>
																	<strong className="font-semibold text-foreground">
																		{title}:
																	</strong>
																	{rest.join(":")}
																</>
															) : (
																item
															)}
														</span>
													</li>
												);
											})}
										</ul>
									</div>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
