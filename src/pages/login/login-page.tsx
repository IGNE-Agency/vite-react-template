import classNames from "classnames";
import Form from "components/form/form";
import { LoginRequestSchema, api } from "lib/api";
import { useAppState } from "lib/app-state";
import useForm from "lib/form";
import { useTranslation } from "react-i18next";
import {
	Link,
	type Location,
	useLocation,
	useNavigate
} from "react-router";
import style from "./login-page.module.scss";

// This module extension enables `useLocation.state` to be typed
declare module "react-router" {
	export function useLocation<T>(): Location<
		T | undefined
	>;
}

const LoginPage = () => {
	const { state } = useLocation<{
		redirect?: string;
	}>();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [, dispatch] = useAppState();
	const form = useForm(LoginRequestSchema);

	const handleSubmit = form.handleSubmit(
		async data => {
			const result = await api.Login(data);

			if (result.ok) {
				dispatch({ type: "login", user: result.data });
				navigate(state?.redirect ?? "/");
			} else {
				throw result.error;
			}
		}
	);

	return (
		<>
			<h1 className={style.fullWidth}>
				{t("pages.login.title")}
			</h1>
			<Form
				form={form}
				onSubmit={handleSubmit}
				className={classNames([
					style.fullWidth,
					style.form
				])}>
				<label className={style.label}>
					<span>{t("forms.fields.email")}</span>
					<input type="text" name="email" />
				</label>
				<div className={style.label}>
					<label className={style.label}>
						<span>{t("forms.fields.password")}</span>
						<input type="password" name="password" />
					</label>
					<Link
						to="/forgot-password"
						className={style.forgotPassword}>
						{t("pages.login.forgotPassword")}
					</Link>
				</div>
				<button type="submit">
					{t("forms.actions.login")}
				</button>
				<Link
					to="/register"
					className={style.register}>
					{t("pages.login.noAccount")}
				</Link>
			</Form>
		</>
	);
};

export default LoginPage;
