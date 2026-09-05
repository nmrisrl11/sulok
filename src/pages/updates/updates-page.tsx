import { APP_INFO } from "@/constants/app-info";
import { CHANGELOG_DATA } from "@/data/changelog";

export function UpdatesPage() {
	return (
		<div className="flex flex-col gap-12 w-full max-w-3xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
			{/* Header Section */}
			<section className="flex flex-col gap-3 text-center sm:text-left w-full items-center sm:items-start">
				<h1
					className="font-sans text-4xl sm:text-5xl font-extrabold italic"
					style={{ fontVariationSettings: "'WONK' 0, 'SOFT' 0" }}
				>
					Updates
				</h1>
				<p className="text-lg font-medium text-muted-foreground">What's new in {APP_INFO.name}.</p>
				<span className="text-sm font-mono font-medium text-foreground px-3 py-1 bg-muted rounded-full mt-1">
					v{CHANGELOG_DATA[0].version}
				</span>
			</section>

			<div className="h-px bg-border w-full" />

			{/* Changelog Entries */}
			<div className="flex flex-col gap-16 w-full">
				{CHANGELOG_DATA.map((release) => (
					<div key={release.version} className="flex flex-col md:flex-row gap-8 md:gap-12 w-full">
						{/* Left Column: Version & Date */}
						<div className="md:w-1/4 shrink-0 flex flex-col gap-1">
							<div className="sticky top-20">
								<h2 className="text-xl font-bold text-primary font-mono">{release.version}</h2>
								<p className="text-sm font-medium text-muted-foreground">{release.date}</p>
							</div>
						</div>

						{/* Right Column: Changes */}
						<div className="md:w-3/4 flex flex-col gap-10">
							{release.title && <h3 className="text-2xl font-bold font-sans">{release.title}</h3>}

							<div className="flex flex-col gap-10">
								{release.changes.map((changeGroup) => (
									<div key={changeGroup.category} className="flex flex-col gap-4">
										<h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
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
														className="flex gap-2.5 text-sm text-foreground/80 leading-snug"
													>
														<span className="text-border select-none mt-1.5 shrink-0 block w-1 h-1 rounded-full bg-foreground/30" />
														<span>
															{hasColon ? (
																<>
																	<strong className="text-foreground font-semibold">
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
