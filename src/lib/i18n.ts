import i18n from "i18next";
import Backend from "i18next-fetch-backend";
import { useEffect, useMemo } from "react";
import {
	initReactI18next,
	useTranslation,
} from "react-i18next";
import * as z from "zod";

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
const supportedLocales = Object.keys(supportedLanguages);

const zodLocaleModules: Readonly<
	Record<string, () => Promise<z.core.$ZodConfig>>
> = Object.fromEntries(
	Object.entries(
		import.meta.glob(
			[
				"/node_modules/zod/v4/locales/*.js",
				"!/node_modules/zod/v4/locales/index.js",
			],
			{
				import: "default",
			},
		),
	).map(([path, loader]) => [
		path.split("/").at(-1)?.replace(".js", ""),
		loader,
	]),
);

/**
 * Switch language of zod default messages
 */
const loadZodLocale = async (locale: string) => {
	const lng = new Intl.Locale(locale).language;
	const loader = zodLocaleModules[lng];
	z.config(await loader());
};

/**
 * Run this once before loading the app so the
 * translations are ready to go.
 */
export const init = async () => {
	await i18n
		.use(Backend)
		.use(initReactI18next)
		.init({
			// Fallback language should be one of supported languages
			supportedLngs: supportedLocales,
			fallbackLng: FALLBACK_LNG,
			// Default to FALLBACK_LNG, even when automatic detection says otherwise.
			lng: FALLBACK_LNG,
			backend: {
				loadPath: (lng: string) => supportedLanguages[lng],
			},
		});

	i18n.on("languageChanged", loadZodLocale);
	loadZodLocale(FALLBACK_LNG);
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
