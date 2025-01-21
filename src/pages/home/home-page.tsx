import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";

const HomePage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.home.title"), []);

	return <div>Home</div>;
};

export default HomePage;
