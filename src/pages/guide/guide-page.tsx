import { CustomHeartIcon, NoteIcon, TrashClockIcon } from "@/components/icons";
import { SEO } from "@/components/seo";
import { APP_INFO } from "@/constants/app-info";
import {
	ClipboardIcon,
	DownloadIcon,
	FolderIcon,
	FolderTreeIcon,
	MonitorSmartphoneIcon,
	MousePointerClickIcon,
	RefreshCcwIcon,
	SearchIcon,
	SparklesIcon,
	WandSparklesIcon,
	ZapIcon,
} from "lucide-react";
import type { ElementType, ReactNode } from "react";
import { CommandPaletteMock } from "./components/command-palette-mock";
import { ContextMenuMock } from "./components/context-menu-mock";
import { DeviceSyncMock } from "./components/device-sync-mock";
import { DragAndDropMock } from "./components/drag-and-drop-mock";
import { FavoritesMock } from "./components/favorites-mock";
import { ImportDataMock } from "./components/import-data-mock";
import { PersonalNotesMock } from "./components/personal-notes-mock";
import { QuickActionBarMock } from "./components/quick-action-bar-mock";
import { QuickCustomizeMock } from "./components/quick-customize-mock";
import { QuickSavePopupMock } from "./components/quick-save-popup-mock";
import { SafetyNetMock } from "./components/safety-net-mock";
import { ShowAllLinksMock } from "./components/show-all-links-mock";
import { SmartClipboardMock } from "./components/smart-clipboard-mock";
import { SyncBrowserBookmarksMock } from "./components/sync-browser-bookmarks-mock";

function GuideSection({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2 px-1">
				<h2 className="font-heading text-xl font-bold">{title}</h2>
			</div>
			<div className="flex flex-col gap-0 divide-y divide-border/50 rounded-xl border border-border/50 bg-card shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-4xl">
				{children}
			</div>
		</div>
	);
}

function GuideItem({
	title,
	description,
	icon: Icon,
	children,
}: {
	title: string;
	description: ReactNode;
	icon: ElementType;
	children?: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-6 p-5 sm:p-6 md:flex-row md:items-start">
			<div className="flex flex-1 items-start gap-4">
				<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
					<Icon className="h-5 w-5" />
				</div>
				<div className="flex flex-1 flex-col gap-1.5">
					<h3 className="font-heading text-base font-bold text-foreground">{title}</h3>
					<div className="text-sm leading-relaxed text-muted-foreground">{description}</div>
				</div>
			</div>
			{children && (
				<div className="flex w-full justify-center md:w-auto md:shrink-0">{children}</div>
			)}
		</div>
	);
}

function Kbd({ children }: { children: ReactNode }) {
	return (
		<kbd className="mx-0.5 inline-flex items-center justify-center rounded-md border border-border/60 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground shadow-sm corner-squircle supports-[corner-shape:squircle]:rounded-md">
			{children}
		</kbd>
	);
}

export function GuidePage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl animate-in flex-col gap-10 px-4 pt-6 pb-20 duration-500 fade-in slide-in-from-bottom-4 md:px-6 md:pt-12">
			<SEO
				title="Guide"
				description="Tips, tricks, and methods to master your corner of the web."
				canonical="/guide"
			/>
			<section className="flex w-full flex-col gap-3 text-center sm:text-left">
				<h1
					className="font-heading text-3xl font-extrabold md:text-4xl"
					style={{ fontVariationSettings: "'WONK' 0, 'SOFT' 0" }}
				>
					Your Guide to {APP_INFO.name}
				</h1>
				<p className="text-lg font-medium text-muted-foreground md:text-xl">
					Tips, tricks, and methods to master your corner of the web.
				</p>
			</section>

			<div className="h-px w-full bg-border/50" />

			<div className="flex flex-col gap-10">
				<GuideSection title="The Fastest Ways to Save">
					<GuideItem
						title="The Quick Save Popup"
						description={`Click the ${APP_INFO.name} extension icon on any page to instantly save it. You can pick a specific folder right from the popup before saving.`}
						icon={MousePointerClickIcon}
					>
						<QuickSavePopupMock />
					</GuideItem>
					<GuideItem
						title="Zero-Click Context Menus"
						description={`Don't want to open the app? Just right-click on any webpage background or directly on a link, and select 'Save to ${APP_INFO.name}'. It saves silently in the background.`}
						icon={ZapIcon}
					>
						<ContextMenuMock />
					</GuideItem>
				</GuideSection>

				<GuideSection title="Saving Inside the App">
					<GuideItem
						title="Smart Clipboard (Global Paste)"
						description={
							<>
								Have a URL copied? Just press <Kbd>Ctrl</Kbd> + <Kbd>V</Kbd> (or <Kbd>Cmd</Kbd> +{" "}
								<Kbd>V</Kbd>) anywhere in the app. {APP_INFO.name} will automatically open the Quick
								Action Bar and paste your link, ready to be saved.
							</>
						}
						icon={ClipboardIcon}
					>
						<SmartClipboardMock />
					</GuideItem>
					<GuideItem
						title="The Quick Action Bar (FAB)"
						description={
							<>
								See that floating Sulo icon at the bottom? Click it to expand the command bar. Paste
								a URL and hit Enter.
							</>
						}
						icon={SparklesIcon}
					>
						<QuickActionBarMock />
					</GuideItem>
				</GuideSection>

				<GuideSection title="Organizing Your Corner">
					<GuideItem
						title="Drag and Drop"
						description="Click and hold any link or folder to drag it into another folder. You can build out an entire nested tree of categories."
						icon={FolderIcon}
					>
						<DragAndDropMock />
					</GuideItem>
					<GuideItem
						title="Favorites"
						description="Click the heart icon on your most-used folders or links. They'll be pinned to the Favorites section for instant access."
						icon={CustomHeartIcon}
					>
						<FavoritesMock />
					</GuideItem>
					<GuideItem
						title="Personal Notes"
						description="You can add annotations and thoughts to any saved link. Look for the small 'squircle' indicator on a card to see which links have notes attached."
						icon={NoteIcon}
					>
						<PersonalNotesMock />
					</GuideItem>
				</GuideSection>

				<GuideSection title="Data Portability & Syncing">
					<GuideItem
						title="Device Sync (P2P)"
						description={`Securely connect and merge your library across devices on your local network. No accounts required—just generate a code and ${APP_INFO.name} handles the rest.`}
						icon={MonitorSmartphoneIcon}
					>
						<DeviceSyncMock />
					</GuideItem>
					<GuideItem
						title="Sync Browser Bookmarks"
						description={`Instantly import all your native browser bookmarks with a single click using the ${APP_INFO.name} extension. We'll perfectly preserve your nested folders and site icons.`}
						icon={RefreshCcwIcon}
					>
						<SyncBrowserBookmarksMock />
					</GuideItem>
					<GuideItem
						title="Importing Backups"
						description={`Moving from another tool? Instantly upload existing data from HTML, CSV, JSON, or TXT files. ${APP_INFO.name} will seamlessly preserve your folders and metadata.`}
						icon={DownloadIcon}
					>
						<ImportDataMock />
					</GuideItem>
				</GuideSection>

				<GuideSection title="Pro Tips & Hidden Features">
					<GuideItem
						title="Quick Customize"
						description={
							<>
								Press <Kbd>Shift</Kbd> + <Kbd>C</Kbd> to open the Quick Customize side drawer.
								Change your theme, layout density, and even Sulo's expression on the fly without
								leaving your current view.
							</>
						}
						icon={WandSparklesIcon}
					>
						<QuickCustomizeMock />
					</GuideItem>
					<GuideItem
						title="The 30-Day Safety Net"
						description="Accidentally deleted a crucial link? Don't panic. Check the Recycle Bin. Deleted items stay there for 30 days before they are permanently erased."
						icon={TrashClockIcon}
					>
						<SafetyNetMock />
					</GuideItem>
					<GuideItem
						title="The Command Palette"
						description={
							<>
								Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to instantly search your entire library. It
								even shows the parent folder as a hint so you know exactly where a link lives.
							</>
						}
						icon={SearchIcon}
					>
						<CommandPaletteMock />
					</GuideItem>
					<GuideItem
						title="Show All Links"
						description="Want to see everything you've ever saved at once? Click the 'Show All Links' icon in the Explorer Toolbar to flatten your library into one massive, sortable list."
						icon={FolderTreeIcon}
					>
						<ShowAllLinksMock />
					</GuideItem>
				</GuideSection>
			</div>
		</div>
	);
}
