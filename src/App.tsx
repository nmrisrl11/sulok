import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/app-layout";
import { AboutPage } from "./pages/about/about-page";
import { HomePage } from "./pages/home/home-page";
import { NotFoundPage } from "./pages/not-found/not-found-page";

function App() {
	return (
		<BrowserRouter>
			<AppLayout>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</AppLayout>
		</BrowserRouter>
	);
}

export default App;
