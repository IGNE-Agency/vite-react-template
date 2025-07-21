import classNames from "classnames";
import Form from "components/form/form";
import Issues from "components/issues/issues";
import { client } from "lib/api";
import { useAuth } from "lib/auth";
import useForm from "lib/form";
import useLocationState from "lib/location-state";
import { usePageTitle } from "lib/page-title";
import { PostApiV1AuthLoginRequestSchema } from "lib/validators.gen";
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
	const [, setToken] = useAuth();
	const form = useForm(PostApiV1AuthLoginRequestSchema);
	usePageTitle(t("pages.login.title"));

	const handleSubmit = form.handleSubmit(async (body) => {
		const { data, error } = await client.POST(
			"/api/v1/auth/login",
			{ body },
		);

		if (error) {
			return error.errors;
		}

		setToken(data);
		navigate(state?.redirect ?? "/");
	});

	// Demo purposes - Remove me
	const handleFakeLogin = () => {
		setToken("logged in");
		navigate(state?.redirect ?? "/");
	};

	return (
		<>
			<h1
				className={classNames([
					theme.title,
					style.textCenter,
				])}
			>
				{t("pages.login.title")}
			</h1>
			<Form
				form={form}
				onSubmit={handleSubmit}
				className={style.form}
			>
				<label className={style.label}>
					<span>{t("forms.fields.email")}</span>
					<input
						autoFocus
						type="text"
						name="email"
						aria-invalid={form.invalidFields?.includes(
							"email",
						)}
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
							aria-invalid={form.invalidFields?.includes(
								"password",
							)}
							className={theme.input}
						/>
						<Issues name="password" form={form} />
					</label>
					<Link
						to="/forgot-password"
						className={classNames([style.forgotPassword])}
					>
						{t("pages.login.forgotPassword")}
					</Link>
				</div>
				<Issues form={form} />
				<button type="submit" className={theme.button}>
					{t("forms.actions.login")}
				</button>
				<button
					type="button"
					className={theme.button}
					onClick={handleFakeLogin}
				>
					Fake login
				</button>
				<Link
					to="/register"
					className={classNames([style.register])}
				>
					{t("pages.login.noAccount")}
				</Link>
			</Form>
		</>
	);
};

export default LoginPage;
