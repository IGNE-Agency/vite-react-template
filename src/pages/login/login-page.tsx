import classNames from "classnames";
import { ErrorText } from "components/error-text/error-text";
import { Button, Form, Input } from "components/form";
import { H1 } from "components/heading/heading";
import { queryClient } from "lib/api";
import { useAuth } from "lib/auth";
import useLocationState from "lib/location-state";
import { usePageTitle } from "lib/page-title";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import style from "./login-page.module.scss";

const LoginPageStateSchema = z.object({
	redirect: z.string().optional(),
});

// TODO: use newly generated type
type ValidationError = {
	message: string;
	errors: { [k: string]: string };
};

const LoginPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.login.title"));
	const locationState = useLocationState(
		LoginPageStateSchema,
	);
	const [, setToken] = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState<ValidationError>();

	const { isPending } = queryClient.useMutation(
		"post",
		"/api/auth/login",
		{
			onError(error) {
				// TODO: heyapi has typed error
				setError(error as ValidationError);
			},
			onSuccess(token) {
				setToken(token);
				navigate(locationState?.redirect || "/");
			},
		},
	);

	const handleSubmit = async (
		evt: React.FormEvent<HTMLFormElement>,
	) => {
		evt.preventDefault();
		const formData = Object.fromEntries(
			new FormData(evt.currentTarget),
		);

		// This would require an actual backend
		// await mutate({ body: formData })

		// biome-ignore lint/suspicious/noConsole: this is an example
		console.info("Loggin in with formdata", formData);
		setToken("logged in");
		navigate(locationState?.redirect || "/");
	};

	return (
		<>
			<H1 size="medium" className={style.textCenter}>
				{t("pages.login.title")}
			</H1>
			<Form
				onSubmit={handleSubmit}
				className={style.form}
				disabled={isPending}
			>
				<label className={style.label} htmlFor="email">
					<Input
						label={t("forms.fields.email")}
						isInvalid={!!error?.errors?.email}
						name="email"
						id="email"
					/>
					<ErrorText>{error?.errors?.email}</ErrorText>
				</label>
				<div className={style.label}>
					<label className={style.label} htmlFor="password">
						<Input
							type="password"
							label={t("forms.fields.password")}
							isInvalid={!!error?.errors?.password}
							name="password"
							id="password"
						/>
						<ErrorText>{error?.errors?.password}</ErrorText>
					</label>

					<Link
						to="/forgot-password"
						className={classNames([style.forgotPassword])}
					>
						{t("pages.login.forgotPassword")}
					</Link>
				</div>

				<ErrorText>{error?.message}</ErrorText>

				<Button type="submit">
					{t("forms.actions.login")}
				</Button>
			</Form>
		</>
	);
};

export default LoginPage;
