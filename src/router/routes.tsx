import { BrowserRouter, Route, Routes } from "react-router";

import {
	AuthLayout,
	ForgotPasswordPage,
	GlobalLayout,
	HomePage,
	LoggedInLayout,
	LoginPage,
	NotFoundPage,
	RegisterPage,
} from "./page-loader";

const Router = () => (
	<BrowserRouter>
		<Routes>
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
		</Routes>
	</BrowserRouter>
);

export default Router;
