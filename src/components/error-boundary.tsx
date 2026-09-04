import { SuloMascot } from "@/components/logo/sulo-mascot";
import { Button } from "@/components/ui/button";
import React from "react";
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	// Only show actual error message in development for a calmer production experience
	const isDev = import.meta.env.DEV;

	return (
		<div className="flex flex-col items-center justify-center w-full py-12 gap-6 text-center animate-in fade-in duration-500">
			<div className="w-48 h-48 sm:w-64 sm:h-64">
				<SuloMascot expression="sad" />
			</div>
			<div className="flex flex-col gap-2">
				<h1 className="font-sans text-3xl font-bold">Uh oh, Sulo tripped!</h1>
				<p className="text-muted-foreground max-w-sm mx-auto">
					{isDev && (error as Error)?.message
						? (error as Error).message
						: "An unexpected error occurred while loading this corner of the web."}
				</p>
			</div>
			<Button onClick={resetErrorBoundary} className="cursor-pointer">
				Let's try that again
			</Button>
		</div>
	);
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
	return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>;
}
