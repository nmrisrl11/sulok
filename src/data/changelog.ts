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
