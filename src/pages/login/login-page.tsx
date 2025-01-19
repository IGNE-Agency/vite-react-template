import Form from "components/form";
import {
	HttpStatus,
	LoginRequest,
	api
} from "lib/api";
import { useAppState } from "lib/app-state";
import useForm from "lib/form";
import { useTranslation } from "react-i18next";
import {
	Location,
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
	const form = useForm<LoginRequest>();
	const [, dispatch] = useAppState();

	const handleSubmit = form.handleSubmit(
		async data => {
			const result = await api.Login(data);

			if (result.ok) {
				dispatch({ type: "login", user: result.data });
				navigate(redirect ?? "/");
			} else {
				switch (result.error.code) {
					case HttpStatus.BadRequest: {
						for (const [
							field,
							issues
						] of Object.entries(result.error.errors)) {
							for (const issue of issues) {
								form.addIssue({
									code: "custom",
									path: [field],
									message: issue
								});
							}
						}
						break;
					}
					case HttpStatus.Forbidden: {
						form.addIssue({
							code: "custom",
							path: ["*"],
							message: result.error.message
						});
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
				<input
					type="text"
					name="email"
					placeholder={t("forms.fields.email")}
				/>
				<input
					type="password"
					name="password"
					placeholder={t("forms.fields.password")}
				/>
				<button type="submit">
					{t("forms.actions.login")}
				</button>
			</Form>
		</>
	);
};

export default LoginPage;
