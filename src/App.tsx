import { AppearanceProvider } from "@/components/appearance-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { AppLayout } from "@/components/layout/app-layout";
import { TrashManager } from "@/components/managers/trash-manager";
import { ThemeProvider } from "@/components/theme-provider";
import { OnboardingProvider } from "@/features/onboarding/components/onboarding-provider";
import { PwaManager } from "@/features/pwa/components/pwa-manager";
import { useGlobalSoundInteractions } from "@/hooks";
import { AboutSkeleton } from "@/pages/about/about-skeleton";
import { HomeRouteFallback } from "@/pages/home/home-route-fallback";
import { InstallSkeleton } from "@/pages/install/install-skeleton";
import { SettingsSkeleton } from "@/pages/settings/settings-skeleton";
import { UpdatesSkeleton } from "@/pages/updates/updates-skeleton";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const HomePage = lazy(() =>
	import("@/pages/home/home-page").then((m) => ({ default: m.HomePage })),
);
const AboutPage = lazy(() =>
	import("@/pages/about/about-page").then((m) => ({ default: m.AboutPage })),
);
const UpdatesPage = lazy(() =>
	import("@/pages/updates/updates-page").then((m) => ({ default: m.UpdatesPage })),
);
const NotFoundPage = lazy(() =>
	import("@/pages/not-found/not-found-page").then((m) => ({ default: m.NotFoundPage })),
);
const SettingsPage = lazy(() =>
	import("@/pages/settings/settings-page").then((m) => ({ default: m.SettingsPage })),
);
const InstallPage = lazy(() =>
	import("@/pages/install/install-page").then((m) => ({ default: m.InstallPage })),
);

function GlobalSoundInteractions() {
	useGlobalSoundInteractions();
	return null;
}

function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="sulok-ui-theme">
			<AppearanceProvider>
				<TrashManager />
				<PwaManager />
				<GlobalSoundInteractions />
				<BrowserRouter>
					<NuqsAdapter>
						<AppLayout>
							<ErrorBoundary>
								<OnboardingProvider>
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
											path="/updates"
											element={
												<Suspense fallback={<UpdatesSkeleton />}>
													<UpdatesPage />
												</Suspense>
											}
										/>
										<Route
											path="/settings"
											element={
												<Suspense fallback={<SettingsSkeleton />}>
													<SettingsPage />
												</Suspense>
											}
										/>
										<Route
											path="/install"
											element={
												<Suspense fallback={<InstallSkeleton />}>
													<InstallPage />
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
								</OnboardingProvider>
							</ErrorBoundary>
						</AppLayout>
					</NuqsAdapter>
				</BrowserRouter>
			</AppearanceProvider>
		</ThemeProvider>
	);
}

export default App;
