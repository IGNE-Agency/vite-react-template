import { createFileRoute } from "@tanstack/react-router";
import { H1 } from "components/heading/heading";
import * as m from "lib/paraglide/messages";
import { useDocumentTitle } from "usehooks-ts";
import style from "./forgot-password.module.scss";

export const Route = createFileRoute(
	"/_auth/forgot-password",
)({
	component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
	useDocumentTitle(m.forgot_password_title());

	return (
		<H1 size="medium" className={style.textCenter}>
			{m.forgot_password_title()}
		</H1>
	);
}
