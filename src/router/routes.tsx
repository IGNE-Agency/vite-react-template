import { BrowserRouter, Route, Routes } from "react-router";

import {
	AppLayout,
	AuthLayout,
	ForgotPasswordPage,
	HomePage,
	LoginPage,
	NotFoundPage,
} from "./page-loader";
import { ProtectedRoute } from "./protected-route";

const Router = () => (
	<BrowserRouter>
		<Routes>
			<Route element={<AuthLayout />}>
				<Route path="login" element={<LoginPage />} />
				<Route
					path="forgot-password"
					element={<ForgotPasswordPage />}
				/>
			</Route>
			<Route element={<AppLayout />}>
				<Route
					index
					element={
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		</Routes>
	</BrowserRouter>
);

export default Router;
