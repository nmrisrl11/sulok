export type ChangelogCategory = "Added" | "Changed" | "Fixed" | "Removed";

export interface ChangelogItem {
	category: ChangelogCategory;
	items: string[];
}

export interface ChangelogRelease {
	version: string;
	date: string;
	title?: string;
	changes: ChangelogItem[];
}

export const CHANGELOG_DATA: ChangelogRelease[] = [
	{
		version: "0.2.0",
		date: "Sep 8, 2026",
		title: "Performance, Settings, and Data Portability",
		changes: [
			{
				category: "Added",
				items: [
					"Data Portability: You can now import and export your entire library (JSON, CSV, and TXT) directly from the new Settings page. All custom logos, images, and saved dates are perfectly preserved.",
					"Dedicated Settings & Sound FX: A beautiful new tabbed Settings page gives you full control over the app, including new interactive UI sound effects.",
					"Action Bar Improvements: The Home page now features an Action Bar with Search and Sort controls to easily find your saved items.",
					"Floating Quick Add: The Quick Link Action Bar is now an expandable floating button that reduces visual clutter. You can expand it via a click or keyboard shortcuts (Ctrl+K or Ctrl+V).",
				],
			},
			{
				category: "Changed",
				items: [
					"Snappier Performance: We completely overhauled how the app renders behind the scenes, ensuring buttery-smooth performance, zero-latency interactions, and faster initial load times even as your library grows.",
					"Sleek Typography: The app now uses the Manrope font for a cleaner, more readable interface, and a sleek monospace font for all web addresses.",
					"Brand Consistency: We now consistently use the term 'items' instead of 'links', and replaced native browser elements with custom branded inputs.",
					"Smarter Link Previews: Sulok now instantly saves and displays high-quality custom logos and images for your links, caching them locally so they load instantly.",
					"Streamlined UI: We decluttered the interface by hiding search and sort controls when your library is empty, and improved keyboard accessibility across the app.",
				],
			},
			{
				category: "Fixed",
				items: [
					"Metadata Accuracy: Fixed issues where editing an existing link or importing data could sometimes lose or revert custom site titles, descriptions, and logos.",
					"Duplicate Detection: Sulok is now much smarter at detecting duplicate links when you save, properly ignoring trailing slashes and 'www.' prefixes.",
					"Selection & Actions: Fixed a bug where the 'Select All' checkbox would select hidden items during a search, and fixed Sulo incorrectly cheering when deleting items.",
					"Visual Polish: Addressed minor visual bugs including missing active states on the header navigation, styling glitches on interactive sliders, and broken image previews for certain websites.",
				],
			},
		],
	},
	{
		version: "0.1.0",
		date: "Sep 5, 2026",
		title: "Initial Release & Public Beta",
		changes: [
			{
				category: "Added",
				items: [
					"Smart Clipboard: Automatically captures valid URLs when you paste anywhere in the app.",
					"Mobile Redesign: Tap anywhere on an item to open it, with a new clean 'More' menu for actions.",
					"Quick Link Action Bar: A sticky bottom bar for rapid URL entry with live previews.",
					"Bulk Actions: Select multiple items at once to delete them with a new animated bottom bar.",
					"Sulo Mascot Expressions: Sulo now reacts with various emotions depending on your actions.",
					"Header Feedback: Friendly Sulo whispers to notify you of actions (e.g., 'Added to your corner').",
					"Dark/Light Theme: Seamless theme switching, complete with an interactive morphing logo.",
					"Link Previews: Automatically fetches rich metadata (title, image) when adding a new link.",
					"Squircle Corners: Premium iOS-style squircle corners for buttons, favicons, and cards.",
					"About Page: A beautifully designed page explaining the Sulok brand and tagline.",
				],
			},
			{
				category: "Changed",
				items: [
					"Typography: Item titles now wrap naturally up to 2 lines for better readability.",
					"Touch Targets: Increased dropdown padding for comfortable tapping on mobile devices.",
					"Link Validation: Strict domain validation before saving to prevent corrupted entries.",
					"URL Schema: The add link input is now case-insensitive for http/https.",
				],
			},
			{
				category: "Fixed",
				items: [
					"Fixed a bug where the bottom action bar overlapped with iOS home indicators.",
					"Fixed the metadata preview failing to show when editing an existing item.",
					"Fixed the Sulo mascot getting stuck in a hover state when navigating on touch devices.",
					"Fixed layout squishing on URL previews inside the Add Item dialog.",
					"Fixed a momentary white flash (FOUC) when loading the app initially in Dark mode.",
				],
			},
		],
	},
];
