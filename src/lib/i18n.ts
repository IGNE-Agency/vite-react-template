import { getLocale } from "lib/paraglide/runtime";
import { useMemo } from "react";
import { z } from "zod";
import { en, nl } from "zod/locales";

const zodLocales = { en, nl };

const isZodLocale = (
	lng: string,
): lng is keyof typeof zodLocales =>
	Object.hasOwn(zodLocales, lng);

export const loadZodLocale = (locale: string) => {
	const lng = locale.substring(0, 2);
	if (isZodLocale(lng)) {
		z.config(zodLocales[lng]());
	}
};

export const useLocale = () => {
	const language = getLocale();
	return useMemo(
		() => new Intl.Locale(language),
		[language],
	);
};
