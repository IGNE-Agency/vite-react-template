import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";
import theme from "style/theme.module.scss";

const NotFoundPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.notFound.title"), []);

	return <h1 className={theme.title}>{t("pages.notFound.title")}</h1>;
};

export default NotFoundPage;
