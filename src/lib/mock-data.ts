export interface LinkItem {
	id: string;
	url: string;
	createdAt: number;
}

export const MOCK_LINKS: LinkItem[] = [
	{
		id: "1",
		url: "https://www.youtube.com",
		createdAt: Date.now() - 100000,
	},
	{
		id: "2",
		url: "https://day-book-app.vercel.app",
		createdAt: Date.now() - 200000,
	},
	{
		id: "3",
		url: "https://ui.shadcn.com/docs/components/base/button",
		createdAt: Date.now() - 300000,
	},
	{
		id: "4",
		url: "https://fontsource.org/?query=fraunces",
		createdAt: Date.now() - 400000,
	},
	{
		id: "5",
		url: "https://appbuildersph.com/apps/daybook",
		createdAt: Date.now() - 500000,
	},
];
