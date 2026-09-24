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
		version: "0.7.0",
		date: "Sep 23, 2026",
		title: "Massive Performance Leap, Import Upgrades, and Refined Mobile UI",
		changes: [
			{
				category: "Added",
				items: [
					"Advanced Import Capabilities: Your folder structures are now perfectly preserved when exporting and importing data. We've also added a beautiful visual tree in the Import Preview screen so you can review exactly where everything goes.",
					"Privacy & Storage Tools: A new Data Storage setting lets you track exactly how much space your library is taking up on your device. We also added an optional 'Referral Tracking' setting so you can anonymously support the websites you discover through Sulok.",
					"Recycle Bin Clarity: Items in the Recycle Bin now clearly display exactly how many days are left before they are permanently deleted.",
				],
			},
			{
				category: "Changed",
				items: [
					"Blazing Fast Scrolling: We completely re-engineered how the app displays items. Whether you have 50 or 5,000 links, scrolling through your library, previewing imports, or moving items is now lightning fast and buttery smooth.",
					"Ergonomic Mobile Design: Managing your library on a phone feels more native than ever. Menus, link additions, and folder creation now elegantly slide up from the bottom of your screen as easy-to-reach drawers, while staying as floating panels on desktop.",
					"Smart Selection Mode: When you're selecting multiple items, tapping an item now intuitively selects it rather than accidentally opening the link or navigating away.",
				],
			},
			{
				category: "Fixed",
				items: [
					"Bulletproof Imports: Fixed a handful of edge cases during data import, ensuring folders merge gracefully and duplicate links are handled correctly—even if they're sitting in the Recycle Bin.",
					"Smoother Drag and Drop: Resolved an issue where dragging items on your phone would awkwardly clip at the edge of the screen, and ensured Favorites reorder perfectly every time.",
					"Accessibility & Navigation Glitches: Fixed annoying bugs where clicking folders from search results wouldn't properly clear the search, and tightened up screen-reader support across the app.",
					"Streamlined UI: Removed the redundant external link button from grid cards to keep the interface cleaner (clicking the card itself opens the link).",
				],
			},
		],
	},
	{
		version: "0.6.0",
		date: "Sep 22, 2026",
		title: "Automated Cleanups, Smoother Scrolling & Refinements",
		changes: [
			{
				category: "Added",
				items: [
					"Automated Recycle Bin: Items in your Recycle Bin are now automatically and permanently deleted after 30 days. We've also added a live visual countdown so you know exactly when an item will disappear.",
					'Smart Drag-and-Drop Hints: When organizing your library, hovering over folders in the breadcrumb navigation now shows helpful status hints (like "Already in this folder") to guide you.',
				],
			},
			{
				category: "Changed",
				items: [
					"Buttery Smooth Scrolling: We've completely overhauled how lists are rendered. You can now scroll through hundreds of items—even grabbing the scrollbar handle at high speed—without any lag or frame drops.",
					"Refined Drag-and-Drop: Moving items around is now much more precise. We've improved collision detection and ensured invalid drops (like dropping an item into its current location) fail silently instead of showing distracting errors.",
					"Fluid Interactions: Quick actions like toggling favorites are now smarter. This prevents visual flickering and notification spam if you click rapidly, while keeping your library perfectly safe.",
				],
			},
			{
				category: "Fixed",
				items: [
					"Mobile Enhancements: Fixed an issue where organizing items on mobile devices would awkwardly clash with native text selection and long-press context menus.",
					"Squashed Bugs: Addressed critical rendering crashes that could occur when rapidly switching between List and Grid views or when heavily interacting with the UI.",
				],
			},
		],
	},
	{
		version: "0.5.0",
		date: "Sep 18, 2026",
		title: "Drag & Drop, Onboarding, and Seamless UX",
		changes: [
			{
				category: "Added",
				items: [
					"Drag-and-Drop Organization: You can now effortlessly move links, folders, or even bulk selections around your library by dragging and dropping them into folders or directly onto the breadcrumb navigation.",
					"Interactive Onboarding: New to Sulok? We've added a helpful onboarding tour and a default 'Welcome to Sulok' folder packed with tips to help you get started.",
					"Smarter Link Saving: When you try to save a link you already have, Sulok now instantly detects it and offers a handy 'Go to link' button (or 'Restore' if it's in the recycle bin) to save you time.",
					"Seamless Loading Experience: We've polished the initial app load to feel significantly smoother, eliminating jarring empty screens when opening the app.",
				],
			},
			{
				category: "Changed",
				items: [
					"Sleeker Navigation & Layout: We completely redesigned the main library view into a spacious single-column layout, replacing the old sidebar with intuitive horizontal navigation tabs alongside the header.",
					"Refined Search & Filtering: The search experience is now cleaner, with disabled autocorrect noise, clickable folder badges to easily locate search results, and a beautiful 'Lost in your corner?' screen if no matches are found.",
					"Intelligent Naming Engine: When creating or copying folders with the same name, Sulok now gracefully handles the numbering exactly like your computer's native operating system (e.g., properly numbering from (1) to (2)).",
					"Polished UI Details: We refined the spacing and styling across the app, including adaptive breadcrumbs that look great on any screen size, perfectly nested toolbars, and softer shadows on the settings pages.",
				],
			},
			{
				category: "Fixed",
				items: [
					"Performance Boosts: We've dramatically improved scrolling and clicking responsiveness in your main library, and eliminated the lag when switching tabs in Settings.",
					"Bulletproof Organization: Fixed a critical bug that allowed folders to be accidentally moved inside themselves, preventing potential library corruption.",
					"Accessibility Enhancements: The drag-and-drop system is now fully accessible via keyboard, and we've ensured the app remains strictly screen-reader friendly.",
					"Squashed Bugs: Addressed several glitches including UI flashes on startup, crashing during the app tour, errors when restoring from the recycle bin, and disappearing toolbars.",
				],
			},
		],
	},
	{
		version: "0.4.0",
		date: "Sep 16, 2026",
		title: "Folders, Grid View & Premium Redesign",
		changes: [
			{
				category: "Added",
				items: [
					"Redesigned Empty States & Navigation: A sleek new horizontal mobile sidebar and beautiful card layouts for empty screens across your library.",
					"Grid View Upgrades: Grid mode now supports checkboxes, bulk actions, dropdown menus, and real website favicons.",
					"New Workspace Themes & Customization: Added Sepia, Sand, Midnight, and Mocha themes, alongside a new Quick Customize sheet (`Shift + C`) to tweak settings instantly.",
					"Smarter Icons & Favoriting: Enjoy a bespoke two-tone folder icon and the ability to instantly favorite multiple links and folders at once.",
				],
			},
			{
				category: "Changed",
				items: [
					"Universal Search & Smart Sorting: The search bar now explores your entire library, and sorting options intelligently group folders and links separately.",
					"Intuitive Organization: The 'Move to...' dialog now features a deep-dive breadcrumb navigation system, making it incredibly easy to nest items.",
					"Refined Interface & Spacing: Upgraded to custom-designed icons throughout the app, cleaned up the toolbar layout, grouped desktop hover actions into sleek floating pills, and improved spacing for better readability.",
					"Context-Aware UX: The bulk action bar is now specific to your current view, new links automatically save to the folder you're browsing, and tapping items in the Recycle Bin safely selects them instead of opening.",
					"Enhanced Undo Feedback: Replaced generic notifications with smooth, morphing animations that tell you exactly what you restored.",
				],
			},
			{
				category: "Fixed",
				items: [
					"Resolved scrolling issues on mobile devices that caused the entire page to shift awkwardly.",
					"Fixed multiple visual glitches, including cut-off selection borders, flashing white screens on dark themes, and stretching toolbars.",
					"Fixed inconsistencies when managing or viewing contents inside deeply nested or Favorited folders.",
					"Resolved keyboard accessibility bugs and prevented shortcuts from accidentally triggering while typing.",
				],
			},
			{
				category: "Removed",
				items: [
					"Removed the old light/dark mode switch in favor of the new Workspace Themes engine.",
				],
			},
		],
	},
	{
		version: "0.3.0",
		date: "Sep 10, 2026",
		title: "Personalization & Performance",
		changes: [
			{
				category: "Added",
				items: [
					"Appearance Customization: You can now fully personalize how Sulok looks! Choose between light and dark themes, pick your favorite accent color, toggle modern rounded corners (squircles), and adjust the layout density for a cozier or more compact feel.",
					"Sulo Customization: You can now fully personalize Sulo's reactions! Choose his default expressions for different scenarios (like when a page is not found or when you copy a link), and customize the specific phrases he whispers to you.",
				],
			},
			{
				category: "Fixed",
				items: [
					"Settings Tab Performance: Fixed a significant lag issue in the Settings tab. Hovering over dropdowns or typing custom whispers is now buttery smooth without causing the entire page to freeze.",
					"Robust Settings Validation: Improved the reliability of the Whisper form by automatically switching tabs to highlight hidden validation errors. Furthermore, the app is now fully resilient against corrupted or manually edited settings in browser local storage.",
					"Cleaned Up Settings: Removed unnecessary icons in the settings header for a cleaner look.",
					"Sleeker Loading Skeletons: Improved loading skeletons to look perfect and be properly visible in both light and dark mode.",
					"Snappier Performance: Completely overhauled how the app renders behind the scenes, eliminating visual stutter when filtering and navigating.",
					"Data Import Stability: Improved the reliability of the data import process to prevent imported items from accidentally overwriting existing ones, and fixed an issue where very old saved dates were not imported correctly.",
				],
			},
		],
	},
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
