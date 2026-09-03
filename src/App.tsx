import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/app-layout";
import { HomePage } from "./pages/home/home-page";

const AboutPage = lazy(() =>
	import("./pages/about/about-page").then((m) => ({ default: m.AboutPage })),
);
const NotFoundPage = lazy(() =>
	import("./pages/not-found/not-found-page").then((m) => ({ default: m.NotFoundPage })),
);

function App() {
	return (
		<BrowserRouter>
			<AppLayout>
				<Suspense
					fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}
				>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/about" element={<AboutPage />} />
						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</Suspense>
			</AppLayout>
		</BrowserRouter>
	);
}

export default App;
