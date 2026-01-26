import { lazyComponent } from "./lazy-component";

export const AppLayout = lazyComponent(
	() => import("layouts/app/app-layout"),
);
export const AuthLayout = lazyComponent(
	() => import("layouts/auth/auth-layout"),
);
export const ForgotPasswordPage = lazyComponent(
	() =>
		import("pages/forgot-password/forgot-password-page"),
);
export const HomePage = lazyComponent(
	() => import("pages/home/home-page"),
);
export const LoginPage = lazyComponent(
	() => import("pages/login/login-page"),
);
export const NotFoundPage = lazyComponent(
	() => import("pages/not-found/not-found-page"),
);
