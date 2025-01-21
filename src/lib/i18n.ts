import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const supportedLanguages = ["en", "nl"] as const;

export const init = async () => {
	await i18n
		.use(
			new Backend(null, {
				loadPath: languages =>
					`/i18n/${languages}.json`
			})
		)
		.use(initReactI18next)
		.init({
			supportedLngs: supportedLanguages,
			fallbackLng: supportedLanguages,
			lng: "en"
		});
	document
		.querySelector(":root")
		?.setAttribute("lang", i18n.resolvedLanguage!);
};

export default i18n;
