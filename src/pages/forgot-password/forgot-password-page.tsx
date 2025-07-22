import {
	Button,
	Form,
	Input,
	Issues,
} from "components/form";
import { H1 } from "components/heading/heading";
import { client } from "lib/api";
import useForm from "lib/form";
import { usePageTitle } from "lib/page-title";
import { PostApiV1AuthForgotPasswordRequestSchema } from "lib/validators.gen";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import style from "./forgot-password-page.module.scss";

const ForgotPasswordPage = () => {
	const { t } = useTranslation();
	const form = useForm(
		PostApiV1AuthForgotPasswordRequestSchema,
	);
	usePageTitle(t("pages.forgotPassword.title"));
	const [requestSent, setRequestSent] = useState(false);
	const [email, setEmail] = useState("");

	const handleSubmit = form.handleSubmit(async (body) => {
		await client.POST("/api/v1/auth/forgot-password", {
			body,
		});
		setRequestSent(true);
	});

	if (requestSent) {
		return (
			<>
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
				form={form}
				onSubmit={handleSubmit}
				className={style.form}
			>
				<label className={style.label} htmlFor="email">
					<Input
						label={t("forms.fields.email")}
						name="email"
						id="email"
						isInvalid={form.invalidFields?.includes(
							"email",
						)}
						onChange={({ currentTarget: { value } }) =>
							setEmail(value)
						}
					/>
					<Issues name="email" form={form} />
				</label>
				<Issues form={form} />

				<Button type="submit">
					{t("forms.actions.requestNewPassword")}
				</Button>
			</Form>
		</>
	);
};

export default ForgotPasswordPage;
