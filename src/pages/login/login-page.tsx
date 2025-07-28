import classNames from "classnames";
import {
	Button,
	Form,
	Input,
	Issues,
} from "components/form";
import { H1 } from "components/heading/heading";
import { queryClient } from "lib/api";
import { useAuth } from "lib/auth";
import useLocationState from "lib/location-state";
import { usePageTitle } from "lib/page-title";
import { V1LoginRequestSchema } from "lib/validators.gen";
import { useState } from "react";
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
	const [genericError, setGenericError] = useState("");
	const [, setToken] = useAuth();
	const navigate = useNavigate();

	const { mutate, isPending } = queryClient.useMutation(
		"post",
		"/api/v1/auth/login",
		{
			onError(error) {
				// TODO: zorm.customIssues
				setGenericError(error.errors[0].message);
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
				<label className={style.label} htmlFor="email">
					<Input
						label={t("forms.fields.email")}
						isInvalid={zorm.errors.email(Boolean)}
						name={zorm.fields.email()}
						id="email"
					/>
					{zorm.errors.email((...issues) => (
						<Issues issues={issues} />
					))}
				</label>
				<div className={style.label}>
					<label className={style.label} htmlFor="password">
						<Input
							type="password"
							label={t("forms.fields.password")}
							isInvalid={zorm.errors.password(Boolean)}
							name={zorm.fields.password()}
							id="password"
						/>
						{zorm.errors.password((...issues) => (
							<Issues issues={issues} />
						))}
					</label>

					<Link
						to="/forgot-password"
						className={classNames([style.forgotPassword])}
					>
						{t("pages.login.forgotPassword")}
					</Link>
				</div>

				{!!genericError && <p>{genericError}</p>}
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
