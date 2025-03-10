import classNames from "classnames";
import Form from "components/form/form";
import Issues from "components/issues/issues";
import { HttpStatus, Login, LoginRequestSchema } from "lib/api";
import { useAppState } from "lib/app-state";
import useForm from "lib/form";
import useLocationState from "lib/location-state";
import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import theme from "style/theme.module.scss";
import { z } from "zod";
import style from "./login-page.module.scss";

const LoginPageStateSchema = z.object({
	redirect: z.string().optional(),
});

const LoginPage = () => {
	const state = useLocationState(LoginPageStateSchema);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [, dispatch] = useAppState();
	const form = useForm(LoginRequestSchema);
	usePageTitle(t("pages.login.title"), []);

	const handleSubmit = form.handleSubmit(async (data) => {
		const result = await Login(data);

		if (result.ok) {
			dispatch({ type: "login", user: result.data });
			navigate(state?.redirect ?? "/");
		} else {
			switch (result.error.code) {
				case HttpStatus.BadRequest:
					return result.error.errors;
				case HttpStatus.InternalServerError:
					return { "*": [result.error.message] };
			}
		}
	});

	return (
		<>
			<h1 className={classNames([theme.title, style.textCenter])}>
				{t("pages.login.title")}
			</h1>
			<Form form={form} onSubmit={handleSubmit} className={style.form}>
				<label className={style.label}>
					<span>{t("forms.fields.email")}</span>
					<input
						autoFocus
						type="text"
						name="email"
						aria-invalid={form.invalidFields?.includes("email")}
						className={theme.input}
					/>
					<Issues name="email" form={form} />
				</label>
				<div className={style.label}>
					<label className={style.label}>
						<span>{t("forms.fields.password")}</span>
						<input
							type="password"
							name="password"
							aria-invalid={form.invalidFields?.includes("password")}
							className={theme.input}
						/>
						<Issues name="password" form={form} />
					</label>
					<Link
						to="/forgot-password"
						className={classNames([theme.link, style.forgotPassword])}
					>
						{t("pages.login.forgotPassword")}
					</Link>
				</div>
				<Issues form={form} />
				<button type="submit" className={theme.button}>
					{t("forms.actions.login")}
				</button>
				<Link
					to="/register"
					className={classNames([theme.link, style.register])}
				>
					{t("pages.login.noAccount")}
				</Link>
			</Form>
		</>
	);
};

export default LoginPage;
