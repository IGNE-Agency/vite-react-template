import classNames from "classnames";
import { ErrorText } from "components/error-text/error-text";
import { Button, Form, Input } from "components/form";
import { H1 } from "components/heading/heading";
import {
	postApiAuthLogin,
	// postApiAuthLogin,
	type ValidationError,
} from "lib/api/heyapi";
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

const LoginPage = () => {
	const { t } = useTranslation();
	usePageTitle(t("pages.login.title"));
	const locationState = useLocationState(
		LoginPageStateSchema,
	);
	const [, setToken] = useAuth();
	const navigate = useNavigate();
	// We don't yet have a recommended form lib
	// For now go for simple controlled inputs with backend validation
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<ValidationError>();
	const [isPending, setIsPending] = useState(false);

	const handleSubmit = async (
		evt: React.FormEvent<HTMLFormElement>,
	) => {
		evt.preventDefault();
		setIsPending(true);

		// This would require an actual backend
		// Note that login and logout are probably the only endpoints that do NOT use tanstack query
		const { data: token, error } = await postApiAuthLogin({
			body: { email, password },
		});

		if (error) {
			setError(error);
			return;
		}

		setToken(token);
		navigate(locationState?.redirect || "/");
		setIsPending(false);
	};

	// REMOVE ME
	const handleFakeLogin = () => {
		setToken("fake");
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
						value={email}
						onChange={(evt) => setEmail(evt.target.value)}
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
							value={password}
							onChange={(evt) =>
								setPassword(evt.target.value)
							}
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
					{t("forms.actions.login")} (note: no backend)
				</Button>
				<Button type="button" onClick={handleFakeLogin}>
					Fake login
				</Button>
			</Form>
		</>
	);
};

export default LoginPage;
