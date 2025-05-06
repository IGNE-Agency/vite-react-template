import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";
import theme from "style/theme.module.scss";

const HomePage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.home.title"));

	return (
		<h1 className={theme.title}>{t("pages.home.title")}</h1>
	);
};

export default HomePage;
