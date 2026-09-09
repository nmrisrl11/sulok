import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settings-store";
import { Link } from "react-router-dom";

export function NotFoundPage() {
	const expression = useSettingsStore((state) => state.settings.suloSettings.expression404);

	return (
		<div className="flex min-h-[50vh] animate-in flex-col items-center justify-center gap-6 text-center duration-500 fade-in">
			<div className="h-48 w-48 sm:h-64 sm:w-64">
				<SuloMascot expression={expression} />
			</div>
			<div className="flex flex-col gap-2">
				<h1 className="font-heading text-3xl font-bold">That corner doesn't exist.</h1>
				<p className="mx-auto max-w-sm text-muted-foreground">
					The page you're looking for isn't here or might have been moved.
				</p>
			</div>
			<Button asChild className="cursor-pointer">
				<Link to="/">Go back home</Link>
			</Button>
		</div>
	);
}
