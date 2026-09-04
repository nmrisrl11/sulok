import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function NotFoundPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center animate-in fade-in duration-500">
			<div className="w-48 h-48 sm:w-64 sm:h-64">
				<SuloMascot expression="confused" />
			</div>
			<div className="flex flex-col gap-2">
				<h1 className="font-sans text-3xl font-bold">That corner doesn't exist.</h1>
				<p className="text-muted-foreground max-w-sm mx-auto">
					The page you're looking for isn't here or might have been moved.
				</p>
			</div>
			<Button asChild className="cursor-pointer">
				<Link to="/">Go back home</Link>
			</Button>
		</div>
	);
}
