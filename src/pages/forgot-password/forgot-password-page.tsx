import classNames from "classnames";
import Form from "components/form/form";
import Issues from "components/issues/issues";
import {
	HttpStatus,
	RequestNewPassword,
	RequestNewPasswordRequestSchema,
} from "lib/api";
import useForm from "lib/form";
import { usePageTitle } from "lib/page-title";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import theme from "style/theme.module.scss";
import style from "./forgot-password-page.module.scss";

const ForgotPasswordPage = () => {
	const { t } = useTranslation();
	const form = useForm(RequestNewPasswordRequestSchema);
	usePageTitle(t("pages.forgotPassword.title"), []);
	const [requestSent, setRequestSent] = useState(false);
	const [email, setEmail] = useState("");

	const handleSubmit = form.handleSubmit(async (data) => {
		const result = await RequestNewPassword(data);

		if (result.ok) {
			setRequestSent(true);
		} else {
			switch (result.error.code) {
				case HttpStatus.BadRequest:
					return result.error.errors;
				case HttpStatus.InternalServerError:
					return { "*": [result.error.message] };
			}
		}
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
							email: <Link to={`mailto:${email}`} className={theme.link} />,
						}}
					/>
				</p>
			</>
		);
	}

	return (
		<>
			<h1 className={classNames([theme.title, style.textCenter])}>
				{t("pages.forgotPassword.title")}
			</h1>
			<Form form={form} onSubmit={handleSubmit} className={style.form}>
				<label className={style.label}>
					<span>{t("forms.fields.email")}</span>
					<input
						type="text"
						name="email"
						onChange={({ currentTarget: { value } }) => setEmail(value)}
						aria-invalid={form.invalidFields?.includes("email")}
						className={theme.input}
					/>
					<Issues name="email" form={form} />
				</label>
				<Issues form={form} />
				<button type="submit" className={theme.button}>
					{t("forms.actions.requestNewPassword")}
				</button>
			</Form>
		</>
	);
};

export default ForgotPasswordPage;
