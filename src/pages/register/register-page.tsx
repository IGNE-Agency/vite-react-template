import classNames from "classnames";
import Form from "components/form/form";
import Issues from "components/issues/issues";
import { HttpStatus, Register, RegisterRequestSchema, roles } from "lib/api";
import { useAppState } from "lib/app-state";
import useForm from "lib/form";
import { usePageTitle } from "lib/page-title";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import style from "./register-page.module.scss";

const RegisterPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [, dispatch] = useAppState();
	const form = useForm(RegisterRequestSchema);
	usePageTitle(t("pages.login.title"), []);

	const handleSubmit = form.handleSubmit(async (data) => {
		const result = await Register(data);

		if (result.ok) {
			dispatch({ type: "login", user: result.data });
			navigate("/");
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
			<h1 className={classNames([style.fullWidth, style.textCenter])}>
				{t("pages.register.title")}
			</h1>
			<Form
				form={form}
				onSubmit={handleSubmit}
				className={classNames([style.fullWidth, style.form])}
			>
				<label className={style.label}>
					<span>{t("forms.fields.email")}</span>
					<input
						autoFocus
						type="text"
						name="email"
						aria-invalid={form.invalidFields?.includes("email")}
					/>
					<Issues name="email" form={form} />
				</label>
				<label className={style.label}>
					<span>{t("forms.fields.name")}</span>
					<input
						type="text"
						name="name"
						aria-invalid={form.invalidFields?.includes("name")}
					/>
					<Issues name="name" form={form} />
				</label>
				<label className={style.label}>
					<span>{t("forms.fields.role")}</span>
					<select
						name="role"
						aria-invalid={form.invalidFields?.includes("role")}
					>
						{roles.map((role) => (
							<option key={role} value={role}>
								{t(`roles.${role}`)}
							</option>
						))}
					</select>
					<Issues name="role" form={form} />
				</label>
				<Issues form={form} />
				<button type="submit">{t("forms.actions.register")}</button>
				<Link to="/login" className={style.alreadyHaveAnAccount}>
					{t("pages.register.alreadyHaveAnAccount")}
				</Link>
			</Form>
		</>
	);
};

export default RegisterPage;
