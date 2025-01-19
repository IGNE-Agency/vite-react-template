import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

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
			supportedLngs: ["en"],
			fallbackLng: "en",
			lng: "en"
		});
	document
		.querySelector(":root")
		?.setAttribute("lang", i18n.resolvedLanguage!);
};

export default i18n;
