import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.notFound.title"), []);

	return <div>Not found</div>;
};

export default NotFoundPage;
