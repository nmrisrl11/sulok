import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/error-boundary";
import { AppLayout } from "./components/layout/app-layout";
import { ThemeProvider } from "./components/theme-provider";
import { AboutSkeleton } from "./pages/about/about-skeleton";
import { HomeRouteFallback } from "./pages/home/home-route-fallback";

const HomePage = lazy(() =>
	import("./pages/home/home-page").then((m) => ({ default: m.HomePage })),
);
const AboutPage = lazy(() =>
	import("./pages/about/about-page").then((m) => ({ default: m.AboutPage })),
);
const NotFoundPage = lazy(() =>
	import("./pages/not-found/not-found-page").then((m) => ({ default: m.NotFoundPage })),
);

function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="sulok-ui-theme">
			<BrowserRouter>
				<AppLayout>
					<ErrorBoundary>
						<Routes>
							<Route
								path="/"
								element={
									<Suspense fallback={<HomeRouteFallback />}>
										<HomePage />
									</Suspense>
								}
							/>
							<Route
								path="/about"
								element={
									<Suspense fallback={<AboutSkeleton />}>
										<AboutPage />
									</Suspense>
								}
							/>
							<Route
								path="*"
								element={
									<Suspense fallback={null}>
										<NotFoundPage />
									</Suspense>
								}
							/>
						</Routes>
					</ErrorBoundary>
				</AppLayout>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
