import AppLayout from "layouts/app-layout";
import AuthLayout from "layouts/auth-layout";
import React from "react";
import {
	BrowserRouter,
	Route,
	Routes
} from "react-router";

const Router = () => (
	<BrowserRouter>
		<Routes>
			<Route element={<AppLayout />}>
				<Route
					path="/"
					Component={React.lazy(
						() => import("pages/home/home-page")
					)}
				/>
			</Route>
			<Route element={<AuthLayout />}>
				<Route
					path="/login"
					Component={React.lazy(
						() => import("pages/login/login-page")
					)}
				/>
			</Route>
			<Route
				path="*"
				Component={React.lazy(
					() =>
						import("pages/not-found/not-found-page")
				)}
			/>
		</Routes>
	</BrowserRouter>
);

export default Router;
