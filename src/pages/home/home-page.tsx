import { H1 } from "components/heading/heading";
import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";
import style from "./home-page.module.scss";

const HomePage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.home.title"));

	return (
		<div className={style.page}>
			<H1 size="medium">{t("pages.home.title")}</H1>
		</div>
	);
};

export default HomePage;
