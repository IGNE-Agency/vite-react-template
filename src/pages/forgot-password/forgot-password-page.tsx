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
import style from "./forgot-password-page.module.scss";

const LoginPage = () => {
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
				<p className={classNames([style.fullWidth, style.textCenter])}>
					<Trans
						t={t}
						i18nKey="pages.forgotPassword.success"
						values={{ email }}
						components={{
							email: <Link to={`mailto:${email}`} className={style.email} />,
						}}
					/>
				</p>
			</>
		);
	}

	return (
		<>
			<h1 className={classNames([style.fullWidth, style.textCenter])}>
				{t("pages.forgotPassword.title")}
			</h1>
			<Form
				form={form}
				onSubmit={handleSubmit}
				className={classNames([style.fullWidth, style.form])}
			>
				<label className={style.label}>
					<span>{t("forms.fields.email")}</span>
					<input
						type="text"
						name="email"
						onChange={({ currentTarget: { value } }) => setEmail(value)}
						aria-invalid={form.invalidFields?.includes("email")}
					/>
					<Issues name="email" form={form} />
				</label>
				<Issues form={form} />
				<button type="submit">{t("forms.actions.requestNewPassword")}</button>
			</Form>
		</>
	);
};

export default LoginPage;
