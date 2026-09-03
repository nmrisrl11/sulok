import { AlertCircleIcon } from "lucide-react";
import React from "react";

export class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean; error: Error | null }
> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="p-8 text-center text-destructive border-dashed border-2 border-destructive/50 rounded-md flex flex-col items-center gap-2">
					<AlertCircleIcon className="h-8 w-8 mb-2 opacity-80" />
					<p className="font-medium">Failed to load content</p>
					<p className="text-sm opacity-80">{this.state.error?.message}</p>
					<button
						className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
						onClick={() => window.location.reload()}
					>
						Reload Page
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}
