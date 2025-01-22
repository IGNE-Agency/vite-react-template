import i18n from "i18next";
import Backend from "i18next-http-backend";
import {
	type UseTranslationResponse,
	initReactI18next,
	useTranslation,
} from "react-i18next";

const supportedLanguages = ["nl-NL", "en-US"] as const;

export const init = async () => {
	await i18n
		.use(
			new Backend(null, {
				loadPath: (languages) => `/i18n/${languages}.json`,
			}),
		)
		.use(initReactI18next)
		.init({
			supportedLngs: supportedLanguages,
			fallbackLng: supportedLanguages,
			lng: "en",
		});
};

export default i18n;

// biome-ignore lint/suspicious/noExplicitAny: Really doesn't matter what types the args have.
const getLocale = (i18n: UseTranslationResponse<any, any>["i18n"]) => {
	const language = i18n.resolvedLanguage ?? supportedLanguages[0];
	return new Intl.Locale(language);
};

export const useLocale = () => {
	const { i18n } = useTranslation();
	return getLocale(i18n);
};

export const useSyncHtmlLangAttribute = () => {
	const { i18n } = useTranslation();
	document
		.querySelector(":root")
		?.setAttribute("lang", getLocale(i18n).language);
};
