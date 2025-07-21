import classNames from "classnames";
import Form from "components/form/form";
import Input from "components/form/input/input";
import Issues from "components/issues/issues";
import { client } from "lib/api";
import { useAuth } from "lib/auth";
import useForm from "lib/form";
import { usePageTitle } from "lib/page-title";
import { PostApiV1AuthRegisterRequestSchema } from "lib/validators.gen";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import theme from "style/theme.module.scss";
import style from "./register-page.module.scss";

const RegisterPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [, setToken] = useAuth();
	const form = useForm(PostApiV1AuthRegisterRequestSchema);
	usePageTitle(t("pages.login.title"));

	const handleSubmit = form.handleSubmit(async (body) => {
		const { data, error } = await client.POST(
			"/api/v1/auth/register",
			{
				body,
			},
		);

		if (error) {
			return error.errors;
		}

		setToken(data);
		navigate("/");
	});

	return (
		<>
			<h1
				className={classNames([
					theme.title,
					style.textCenter,
				])}
			>
				{t("pages.register.title")}
			</h1>
			<Form
				form={form}
				onSubmit={handleSubmit}
				className={style.form}
			>
				<label className={style.label} htmlFor="email">
					<Input
						label={t("forms.fields.email")}
						autoFocus
						name="email"
						id="email"
						isInvalid={form.invalidFields?.includes(
							"email",
						)}
					/>
					<Issues name="email" form={form} />
				</label>
				<label className={style.label} htmlFor="name">
					<Input
						label={t("forms.fields.name")}
						name="name"
						id="name"
						isInvalid={form.invalidFields?.includes("name")}
					/>
					<Issues name="name" form={form} />
				</label>
				<Issues form={form} />

				<button type="submit" className={theme.button}>
					{t("forms.actions.register")}
				</button>
				<Link
					to="/login"
					className={classNames([
						style.alreadyHaveAnAccount,
					])}
				>
					{t("pages.register.alreadyHaveAnAccount")}
				</Link>
			</Form>
		</>
	);
};

export default RegisterPage;
