import LoadingIndicator from "components/loading-indicator/loading-indicator";
import PostsPage from "pages/posts/posts-page";
import React, { type ExoticComponent, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

const lazy =
	(Component: ExoticComponent) =>
	// biome-ignore lint/suspicious/noExplicitAny: Don't care whate the type is
	(props: any) => (
		<Suspense fallback={<LoadingIndicator />}>
			<Component {...props} />
		</Suspense>
	);

const LoggedInLayout = lazy(React.lazy(() => import("layouts/app/app-layout")));
const AuthLayout = lazy(React.lazy(() => import("layouts/auth/auth-layout")));
const GlobalLayout = lazy(
	React.lazy(() => import("layouts/global/global-layout")),
);
const ForgotPasswordPage = lazy(
	React.lazy(() => import("pages/forgot-password/forgot-password-page")),
);
const HomePage = lazy(React.lazy(() => import("pages/home/home-page")));
const LoginPage = lazy(React.lazy(() => import("pages/login/login-page")));
const NotFoundPage = lazy(
	React.lazy(() => import("pages/not-found/not-found-page")),
);
const RegisterPage = lazy(
	React.lazy(() => import("pages/register/register-page")),
);

const Router = () => (
	<BrowserRouter>
		<Routes>
			<Route element={<GlobalLayout />}>
				<Route element={<LoggedInLayout />}>
					<Route index element={<HomePage />} />
					<Route path="posts" element={<PostsPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Route>
				<Route element={<AuthLayout />}>
					<Route path="login" element={<LoginPage />} />
					<Route path="register" element={<RegisterPage />} />
					<Route path="forgot-password" element={<ForgotPasswordPage />} />
				</Route>
			</Route>
		</Routes>
	</BrowserRouter>
);

export default Router;
