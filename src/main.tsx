import AppLayout from "layouts/app-layout";
import AuthLayout from "layouts/auth-layout";
import { Role } from "lib/api";
import { useAppState } from "lib/app-state";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	BrowserRouter,
	Navigate,
	Route,
	RouteProps,
	Routes
} from "react-router";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error(
		"Something has gone terribly wrong. The app couldn't find its home :("
	);
}

const root = createRoot(rootElement);

type ProtectedRouteProps = RouteProps &
	Readonly<{
		role?: Role;
	}>;

const ProtectedRoute = ({
	path,
	...props
}: ProtectedRouteProps) => {
	const [{ user }] = useAppState();

	if (!user) {
		return (
			<Navigate
				to="/login"
				replace
				state={{ redirect: path }}
				{...props}
			/>
		);
	}

	return <Route path={path} {...props} />;
};

root.render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<ProtectedRoute
						path="/"
						Component={React.lazy(
							() => import("pages/home/home-page")
						)}
					/>
				</Route>
				<Route element={<AuthLayout />}>
					<Route
						path="/"
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
	</StrictMode>
);
