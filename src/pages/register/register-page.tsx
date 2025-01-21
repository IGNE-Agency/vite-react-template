import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.register.title"), []);

	return <div>RegisterPage</div>;
};

export default RegisterPage;
