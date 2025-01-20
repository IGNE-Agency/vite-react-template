import AppLayout from "layouts/app-layout";
import AuthLayout from "layouts/auth-layout";
import HomePage from "pages/home/home-page";
import LoginPage from "pages/login/login-page";
import NotFoundPage from "pages/not-found/not-found-page";
import {
	BrowserRouter,
	Route,
	Routes
} from "react-router";

// TODO: figure out lazy loading
const Router = () => (
	<BrowserRouter>
		<Routes>
			<Route element={<AppLayout />}>
				<Route index element={<HomePage />} />
			</Route>
			<Route element={<AuthLayout />}>
				<Route path="/login" element={<LoginPage />} />
			</Route>
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	</BrowserRouter>
);

export default Router;
