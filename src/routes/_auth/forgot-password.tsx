import { createFileRoute } from "@tanstack/react-router";
import { H1 } from "components/heading/heading";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "usehooks-ts";
import style from "./forgot-password.module.scss";

export const Route = createFileRoute(
	"/_auth/forgot-password",
)({
	component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
	const { t } = useTranslation();
	useDocumentTitle(t("pages.forgotPassword.title"));

	return (
		<H1 size="medium" className={style.textCenter}>
			{t("pages.forgotPassword.title")}
		</H1>
	);
}
