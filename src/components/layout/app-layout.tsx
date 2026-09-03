import { Header } from "./header";
import { MainContent } from "./main-content";

export function AppLayout() {
	return (
		<div className="bg-background min-h-screen flex flex-col font-geist">
			<div className="mx-auto w-full max-w-3xl flex flex-col">
				<Header />
				<div className="p-6 pt-12">
					<MainContent />
				</div>
			</div>
		</div>
	);
}
