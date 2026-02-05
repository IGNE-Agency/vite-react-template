import { H1 } from "components/heading/heading";
import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";
import style from "./forgot-password-page.module.scss";

const ForgotPasswordPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.forgotPassword.title"));

	return (
		<H1 size="medium" className={style.textCenter}>
			{t("pages.forgotPassword.title")}
		</H1>
	);
};

export default ForgotPasswordPage;
