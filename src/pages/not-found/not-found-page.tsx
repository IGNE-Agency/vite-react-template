import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.notFound.title"), []);

	return <h1>{t("pages.notFound.title")}</h1>;
};

export default NotFoundPage;
