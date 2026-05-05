import { createFileRoute } from "@tanstack/react-router";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { H1 } from "components/heading/heading";
import * as m from "paraglide/messages";
import style from "./-forgot-password.module.scss";

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
