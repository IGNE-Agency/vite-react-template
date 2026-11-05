// Note: this file is only used build-time
// Taken from https://paraglidejs.com/tanstack-router#typesafe-translated-pathnames
// But with required route paths

import type { Locale } from "./src/lib/paraglide/runtime.js";
import type { FileRoutesByTo } from "./src/routeTree.gen.ts";

// All registered route paths.
type RoutePath = keyof FileRoutesByTo;

// All route paths that need to be translated.
// Index paths are excluded. Add any others that need exclusion.
type RequiredRoutePath = Exclude<RoutePath, `${string}/`>;

type TranslatedPathname = Readonly<{
	pattern: string;
	localized: Array<[Locale, string]>;
}>;

const toUrlPattern = (path: string): string =>
	path
		.replace(/\/\$$/, "/:path(.*)?")
		.replace(/\{-\$([a-zA-Z0-9_]+)\}/g, ":$1?")
		.replace(/\$([a-zA-Z0-9_]+)/g, ":$1")
		.replace(/\/+$/, "");

const isLocaleOf = (
	locales: Readonly<Record<Locale, string>>,
	locale: string,
): locale is Locale => Object.hasOwn(locales, locale);

const createTranslatedPathnames = (
	input: Record<RequiredRoutePath, Record<Locale, string>> &
		Partial<Record<RoutePath, Record<Locale, string>>>,
): TranslatedPathname[] =>
	Object.entries(input).map(([pattern, locales]) => ({
		pattern: toUrlPattern(pattern),
		localized: Object.entries(locales).flatMap(
			([locale, path]): [Locale, string][] =>
				isLocaleOf(locales, locale)
					? [[locale, toUrlPattern(path)]]
					: [],
		),
	}));

/**
 * Add a route's translations here, keyed by its router path.
 */
export const translatedPathnames =
	createTranslatedPathnames({
		"/login": {
			"en-US": "/login",
			"nl-NL": "/inloggen",
		},
		"/forgot-password": {
			"en-US": "/forgot-password",
			"nl-NL": "/wachtwoord-vergeten",
		},
		"/form-example": {
			"en-US": "/form-example",
			"nl-NL": "/formulier-voorbeeld",
		},
	});
