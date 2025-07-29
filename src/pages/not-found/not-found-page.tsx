import { H1 } from "components/heading/heading";
import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";
import style from "./not-found-page.module.scss";

const NotFoundPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.notFound.title"));

	return (
		<H1 size="medium" className={style.page}>
			{t("pages.notFound.title")}
		</H1>
	);
};

export default NotFoundPage;
