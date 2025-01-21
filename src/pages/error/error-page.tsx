import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";

type ErrorPageProps = Readonly<{
	error: Error;
}>;

const ErrorPage = ({ error }: ErrorPageProps) => {
	const { t } = useTranslation();
	usePageTitle(t("pages.error.title"), []);

	return <pre>{error.toString()}</pre>;
};

export default ErrorPage;
