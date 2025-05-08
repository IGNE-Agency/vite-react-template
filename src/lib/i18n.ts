import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import {
	initReactI18next,
	useTranslation,
} from "react-i18next";

// Authomatically detect supported languages
const supportedLocales = Object.keys(
	import.meta.glob("/public/i18n/*.json", {
		query: "?url",
		import: "default",
	}),
).map((path) =>
	path.replaceAll(/\/public\/i18n\/|\.json/g, ""),
);

export const init = () =>
	i18n
		.use(Backend)
		.use(LanguageDetector)
		.use(initReactI18next)
		.init({
			supportedLngs: supportedLocales,
			fallbackLng: import.meta.env.PROD ? "en-US" : "dev",
			nonExplicitSupportedLngs: true,
		});

export const useLocale = () => {
	const { i18n } = useTranslation();
	return new Intl.Locale(i18n.language);
};

export const useSyncHtmlLangAttribute = () => {
	const { i18n } = useTranslation();
	document
		.querySelector(":root")
		?.setAttribute("lang", i18n.language);
};
