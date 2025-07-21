import LoadingIndicator from "components/loading-indicator/loading-indicator";
import React, {
	type ExoticComponent,
	Suspense,
} from "react";

const lazy =
	(Component: ExoticComponent) =>
	// biome-ignore lint/suspicious/noExplicitAny: Don't care whate the type is
	(props: any) => (
		<Suspense fallback={<LoadingIndicator />}>
			<Component {...props} />
		</Suspense>
	);

export const AppLayout = lazy(
	React.lazy(() => import("layouts/app/app-layout")),
);
export const AuthLayout = lazy(
	React.lazy(() => import("layouts/auth/auth-layout")),
);
export const ForgotPasswordPage = lazy(
	React.lazy(
		() =>
			import("pages/forgot-password/forgot-password-page"),
	),
);
export const GlobalLayout = lazy(
	React.lazy(() => import("layouts/global/global-layout")),
);
export const HomePage = lazy(
	React.lazy(() => import("pages/home/home-page")),
);
export const LoginPage = lazy(
	React.lazy(() => import("pages/login/login-page")),
);
export const NotFoundPage = lazy(
	React.lazy(
		() => import("pages/not-found/not-found-page"),
	),
);
export const RegisterPage = lazy(
	React.lazy(() => import("pages/register/register-page")),
);
