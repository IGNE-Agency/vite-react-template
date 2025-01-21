import LoggedInLayout from "layouts/app/app-layout";
import AuthLayout from "layouts/auth/auth-layout";
import GlobalLayout from "layouts/global/global-layout";
import ForgotPasswordPage from "pages/forgot-password/forgot-password-page";
import HomePage from "pages/home/home-page";
import LoginPage from "pages/login/login-page";
import NotFoundPage from "pages/not-found/not-found-page";
import RegisterPage from "pages/register/register-page";
import {
	BrowserRouter,
	Route,
	Routes
} from "react-router";

// TODO: figure out lazy loading
const routes = (
	<Route element={<GlobalLayout />}>
		<Route element={<LoggedInLayout />}>
			<Route index element={<HomePage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Route>
		<Route element={<AuthLayout />}>
			<Route path="login" element={<LoginPage />} />
			<Route
				path="register"
				element={<RegisterPage />}
			/>
			<Route
				path="forgot-password"
				element={<ForgotPasswordPage />}
			/>
		</Route>
	</Route>
);

const Router = () => (
	<BrowserRouter>
		<Routes>{routes}</Routes>
	</BrowserRouter>
);

export default Router;
