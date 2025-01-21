import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";

const ForgotPasswordPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.forgotPassword.title"), []);

	return <div>ForgotPasswordPage</div>;
};

export default ForgotPasswordPage;
