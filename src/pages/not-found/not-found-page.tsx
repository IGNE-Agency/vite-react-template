import classNames from "classnames";
import layout from "layouts/app/app-layout.module.scss";
import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";
import theme from "style/theme.module.scss";
import style from "./not-found-page.module.scss";

const NotFoundPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.notFound.title"));

	return (
		<h1 className={classNames(style.page, theme.title)}>
			{t("pages.notFound.title")}
		</h1>
	);
};

export default NotFoundPage;
