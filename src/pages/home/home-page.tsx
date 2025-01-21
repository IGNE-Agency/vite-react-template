import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";

const HomePage = () => {
	const { t, i18n } = useTranslation();
	usePageTitle(t("pages.home.title"), []);

	console.log(i18n.resolvedLanguage);

	return <h1>{t("pages.home.title")}</h1>;
};

export default HomePage;
