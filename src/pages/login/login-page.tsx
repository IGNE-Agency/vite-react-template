import classNames from "classnames";
import { ErrorText } from "components/error-text/error-text";
import {
	Button,
	Form,
	Input,
	Issues,
} from "components/form";
import {
	Field,
	FieldError,
	FieldLabel,
} from "components/form/field/field";
import { H1 } from "components/heading/heading";
import { queryClient } from "lib/api";
import { useAuth } from "lib/auth";
import useLocationState from "lib/location-state";
import { usePageTitle } from "lib/page-title";
import useBackendError from "lib/useBackendError";
import { V1LoginRequestSchema } from "lib/validators.gen";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { useZorm } from "react-zorm";
import { z } from "zod";
import style from "./login-page.module.scss";

const LoginPageStateSchema = z.object({
	redirect: z.string().optional(),
});

const LoginPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.login.title"));
	const locationState = useLocationState(
		LoginPageStateSchema,
	);
	const [, setToken] = useAuth();
	const navigate = useNavigate();
	const [backendErrors, handleBackendErrors] =
		useBackendError();

	const { mutate, isPending } = queryClient.useMutation(
		"post",
		"/api/v1/auth/login",
		{
			onError(error) {
				handleBackendErrors(error);
			},
			onSuccess(token) {
				setToken(token);
				navigate(locationState?.redirect || "/");
			},
		},
	);

	const zorm = useZorm("login", V1LoginRequestSchema, {
		onValidSubmit: async (evt) => {
			evt.preventDefault();
			mutate({ body: evt.data });
		},
		customIssues: backendErrors.formIssues,
	});

	// Demo purposes - Remove me
	const handleFakeLogin = () => {
		setToken("logged in");
		navigate(locationState?.redirect || "/");
	};

	return (
		<>
			<H1 size="medium" className={style.textCenter}>
				{t("pages.login.title")}
			</H1>
			<Form
				ref={zorm.ref}
				className={style.form}
				disabled={isPending}
			>
				<Field name={zorm.fields.email()}>
					<FieldLabel>{t("forms.fields.email")}</FieldLabel>
					<Input isInvalid={zorm.errors.email(Boolean)} />
					<FieldError>
						{zorm.errors.email((...issues) => (
							<Issues issues={issues} />
						))}
					</FieldError>
				</Field>
				<Field name={zorm.fields.password()}>
					<FieldLabel>
						{t("forms.fields.password")}
					</FieldLabel>
					<Input
						type="password"
						isInvalid={zorm.errors.password(Boolean)}
					/>
					<FieldError>
						{zorm.errors.password((...issues) => (
							<Issues issues={issues} />
						))}
					</FieldError>

					<Link
						to="/forgot-password"
						className={classNames([style.forgotPassword])}
					>
						{t("pages.login.forgotPassword")}
					</Link>
				</Field>

				{!!backendErrors.genericError && (
					<ErrorText>
						{backendErrors.genericError}
					</ErrorText>
				)}
				<Button type="submit">
					{t("forms.actions.login")}
				</Button>
				<Button onClick={handleFakeLogin}>
					Fake login
				</Button>
			</Form>
		</>
	);
};

export default LoginPage;
