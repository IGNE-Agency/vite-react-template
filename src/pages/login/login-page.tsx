import Form from "components/form/form";
import {
	HttpStatus,
	type LoginRequest,
	api
} from "lib/api";
import { useAppState } from "lib/app-state";
import useForm from "lib/form";
import { useTranslation } from "react-i18next";
import {
	type Location,
	useLocation,
	useNavigate
} from "react-router";

// This module extension enables `useLocation.state` to be typed
declare module "react-router" {
	export function useLocation<T>(): Location<T>;
}

const LoginPage = () => {
	const {
		state: { redirect }
	} = useLocation<{ redirect?: string }>();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [, dispatch] = useAppState();
	const form = useForm<LoginRequest>();

	const handleSubmit = form.handleSubmit(
		async data => {
			const result = await api.Login(data);

			if (result.ok) {
				dispatch({ type: "login", user: result.data });
				navigate(redirect ?? "/");
			} else {
				switch (result.error.code) {
					case HttpStatus.BadRequest: {
						throw result.error;
					}
					case HttpStatus.Forbidden: {
						form.addIssues([result.error.message]);
						break;
					}
				}
			}
		}
	);

	return (
		<>
			<h1>{t("pages.login.title")}</h1>
			<Form form={form} onSubmit={handleSubmit}>
				<label>
					<span>{t("forms.fields.email")}</span>
					<input type="text" name="email" />
				</label>
				<label>
					<span>{t("forms.fields.password")}</span>
					<input type="password" name="password" />
				</label>
				<button type="submit">
					{t("forms.actions.login")}
				</button>
			</Form>
		</>
	);
};

export default LoginPage;
