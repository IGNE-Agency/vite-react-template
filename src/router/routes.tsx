import { BrowserRouter, Route, Routes } from "react-router";

import {
	AppLayout,
	AuthLayout,
	ForgotPasswordPage,
	GlobalLayout,
	HomePage,
	LoginPage,
	NotFoundPage,
	RegisterPage,
} from "./page-loader";
import { ProtectedRoute } from "./protected-route";

const Router = () => (
	<BrowserRouter>
		<Routes>
			<Route element={<GlobalLayout />}>
				<Route
					element={
						<ProtectedRoute>
							<AppLayout />
						</ProtectedRoute>
					}
				>
					<Route index element={<HomePage />} />
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
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		</Routes>
	</BrowserRouter>
);

export default Router;
