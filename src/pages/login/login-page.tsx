import classNames from "classnames";
import {
	Button,
	Form,
	Input,
	Issues,
} from "components/form";
import { H1 } from "components/heading/heading";
import { client } from "lib/api";
import { useAuth } from "lib/auth";
import useForm from "lib/form";
import useLocationState from "lib/location-state";
import { usePageTitle } from "lib/page-title";
import { V1LoginRequestSchema } from "lib/validators.gen";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
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
	const form = useForm(V1LoginRequestSchema);
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
			<H1 size="medium" className={style.textCenter}>
				{t("pages.login.title")}
			</H1>
			<Form
				form={form}
				onSubmit={handleSubmit}
				className={style.form}
			>
				<label className={style.label} htmlFor="email">
					<Input
						label={t("forms.fields.email")}
						isInvalid={form.invalidFields?.includes(
							"email",
						)}
						name="email"
						id="email"
					/>
					<Issues name="email" form={form} />
				</label>
				<div className={style.label}>
					<label className={style.label} htmlFor="password">
						<Input
							type="password"
							label={t("forms.fields.password")}
							isInvalid={form.invalidFields?.includes(
								"password",
							)}
							name="password"
							id="password"
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

				<Button type="submit">
					{t("forms.actions.login")}
				</Button>
				<Button onClick={handleFakeLogin}>
					Fake login
				</Button>
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
