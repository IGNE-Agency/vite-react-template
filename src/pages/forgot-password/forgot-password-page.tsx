import {
	Button,
	Form,
	Input,
	Issues,
} from "components/form";
import { H1 } from "components/heading/heading";
import { queryClient } from "lib/api";
import { usePageTitle } from "lib/page-title";

import { ErrorText } from "components/error-text/error-text";
import useBackendError from "lib/useBackendError";
import { V1ForgotPasswordRequestSchema } from "lib/validators.gen";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useZorm } from "react-zorm";
import style from "./forgot-password-page.module.scss";

const ForgotPasswordPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.forgotPassword.title"));
	const [email, setEmail] = useState("");
	const [backendErrors, handleBackendErrors] =
		useBackendError();

	// DEV: showcase what it looks like with backend errors
	// Normally you would just call `handleBackendErrors` in the `onError` mutation option
	useEffect(() => {
		handleBackendErrors({
			errors: {
				email: ["email does not exist"],
			},
			message: "Something went terribly wrong",
		});
	}, [handleBackendErrors]);

	const { mutate, isPending, isSuccess, error } =
		queryClient.useMutation(
			"post",
			"/api/v1/auth/forgot-password",
			{
				onError(error) {
					handleBackendErrors(error);
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
			customIssues: backendErrors.formIssues,
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

				{backendErrors.genericError && (
					<ErrorText>
						{backendErrors.genericError}
					</ErrorText>
				)}
				<Button type="submit">
					{t("forms.actions.requestNewPassword")}
				</Button>
			</Form>
		</>
	);
};

export default ForgotPasswordPage;
