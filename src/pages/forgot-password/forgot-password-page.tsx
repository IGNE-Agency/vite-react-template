import {
	Button,
	Form,
	Input,
	Issues,
} from "components/form";
import { H1 } from "components/heading/heading";
import { queryClient } from "lib/api";
import { usePageTitle } from "lib/page-title";
import { V1ForgotPasswordRequestSchema } from "lib/validators.gen";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useZorm } from "react-zorm";
import style from "./forgot-password-page.module.scss";

const ForgotPasswordPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.forgotPassword.title"));
	const [email, setEmail] = useState("");

	const { mutate, isPending, isSuccess } =
		queryClient.useMutation(
			"post",
			"/api/v1/auth/forgot-password",
			{
				onError(error) {
					// TODO: zorm.customIssues
				},
			},
		);

	const zorm = useZorm(
		"login",
		V1ForgotPasswordRequestSchema,
		{
			onValidSubmit: async (evt) => {
				evt.preventDefault();
				setEmail(evt.data.email);
				mutate({ body: evt.data });
			},
		},
	);

	if (isSuccess) {
		return (
			<>
				<H1 size="medium" className={style.textCenter}>
					{t("pages.forgotPassword.title")}
				</H1>
				<p className={style.textCenter}>
					<Trans
						t={t}
						i18nKey="pages.forgotPassword.success"
						values={{ email }}
						components={{
							email: <Link to={`mailto:${email}`} />,
						}}
					/>
				</p>
			</>
		);
	}

	return (
		<>
			<H1 size="medium" className={style.textCenter}>
				{t("pages.forgotPassword.title")}
			</H1>
			<Form
				ref={zorm.ref}
				className={style.form}
				disabled={isPending}
			>
				<label className={style.label} htmlFor="email">
					<Input
						label={t("forms.fields.email")}
						name={zorm.fields.email()}
						id="email"
						isInvalid={zorm.errors.email(Boolean)}
					/>
					{zorm.errors.email((...issues) => (
						<Issues issues={issues} />
					))}
				</label>

				<Button type="submit">
					{t("forms.actions.requestNewPassword")}
				</Button>
			</Form>
		</>
	);
};

export default ForgotPasswordPage;
