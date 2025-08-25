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
import { usePageTitle } from "lib/page-title";
import { V1RegisterRequestSchema } from "lib/validators.gen";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import style from "./register-page.module.scss";

const RegisterPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [, setToken] = useAuth();
	const form = useForm(V1RegisterRequestSchema);
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
			<H1 size="small" className={style.textCenter}>
				{t("pages.register.title")}
			</H1>
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

				<Button type="submit">
					{t("forms.actions.register")}
				</Button>
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
