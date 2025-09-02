import i18n from "i18next";
import Backend from "i18next-http-backend";
import { useEffect, useMemo } from "react";
import {
	initReactI18next,
	useTranslation,
} from "react-i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import {
	default as ZodEnUs,
	default as ZodNlNl,
} from "zod-i18n-map/locales/nl/zod.json";

const LOCALSTORAGE_LOCALE_KEY = "locale";
const FALLBACK_LNG =
	localStorage.getItem(LOCALSTORAGE_LOCALE_KEY) ?? "nl-NL";

/**
 * Reads a file path and returns the filename.
 *
 * This also discards any hash that might be
 * appended by build systems.
 *
 * Example:
 * ```ts
 * getLocaleFromFilePath("src/i18n/nl-NL.json") // -> "nl-NL"
 * getLocaleFromFilePath("src/i18n/en-US.sdf3usbfs.json") // -> "en-US"
 * ```
 */
const getLocaleFromFilePath = (path: string) =>
	path
		.split("/")
		.at(-1)
		?.split(".")
		.slice(0, -1)
		.join(".") ?? FALLBACK_LNG;

/** Dynamic import of all json files in i18n,
 * parse their filenames and use them as locales
 * and load their url during build so they're statically
 * built to prevent caching as static assets.
 */
const supportedLanguages = Object.fromEntries(
	await Promise.all(
		Object.entries(
			await import.meta.glob("../i18n/*.json", {
				query: "?url",
				import: "default",
			}),
		).map(async ([path, resolveFilename]) => [
			getLocaleFromFilePath(path),
			await resolveFilename(),
		]),
	),
);

const supportedLanguageNames = Object.keys(
	supportedLanguages,
);

/**
 * Run this once before loading the app so the
 * translations are ready to go.
 */
export const init = async () => {
	await i18n
		.use(
			new Backend(null, {
				loadPath: (lng) =>
					supportedLanguages[lng.toString()],
			}),
		)
		.use(initReactI18next)
		.init({
			// Supported and fallback languages are the same
			supportedLngs: supportedLanguageNames,
			fallbackLng: FALLBACK_LNG,

			// Use zod error translations together with backend plugin
			partialBundledLanguages: true,
			resources: {
				"nl-NL": { zod: ZodNlNl },
				"en-US": { zod: ZodEnUs },
			},

			// Default to FALLBACK_LNG, even when automatic detection
			// says otherwise.
			lng: FALLBACK_LNG,
		});
	z.setErrorMap(zodI18nMap);
};

export default i18n;

/**
 * A hook for returning the current language from
 * i18n as an `Intl.Locale`
 */
export const useLocale = () => {
	const { i18n } = useTranslation();

	const language = i18n.resolvedLanguage ?? FALLBACK_LNG;

	const locale = useMemo(
		() => new Intl.Locale(language),
		[language],
	);

	return locale;
};

/**
 * A hook for syncing up the [lang] attribute
 * of the document to the value in i18n.
 */
export const useSyncHtmlLangAttribute = () => {
	const locale = useLocale().toString();

	useEffect(() => {
		localStorage.setItem(LOCALSTORAGE_LOCALE_KEY, locale);

		document
			.querySelector(":root")
			?.setAttribute("lang", locale);
	}, [locale]);
};
