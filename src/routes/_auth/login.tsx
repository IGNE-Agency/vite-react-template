import {
	createFileRoute,
	Link,
	useNavigate,
} from "@tanstack/react-router";
import classNames from "classnames";
import { ErrorText } from "components/error-text/error-text";
import { Button, Form, Input } from "components/form";
import { H1 } from "components/heading/heading";
import {
	postApiAuthLogin,
	type ValidationError,
} from "lib/heyapi";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import { useState } from "react";
import z from "zod";
import style from "./login.module.scss";

const loginSearchSchema = z.object({
	redirect: z.optional(
		z.string().startsWith("/").catch("/"),
	),
});

export const Route = createFileRoute("/_auth/login")({
	validateSearch: loginSearchSchema,
	head: () => ({
		meta: [{ title: makePageTitle(m.login_title()) }],
	}),
	component: LoginPage,
});

function LoginPage() {
	const { redirect } = Route.useSearch();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<ValidationError>();
	const [isPending, setIsPending] = useState(false);

	const handleSubmit = async (
		evt: React.FormEvent<HTMLFormElement>,
	) => {
		evt.preventDefault();
		setIsPending(true);

		// Auth endpoints do not use TanStack Query
		const result = await postApiAuthLogin({
			body: { email, password },
		});

		if (result.error) {
			setError(result.error);
			setIsPending(false);
			return;
		}

		navigate({ to: redirect || "/" });
	};

	return (
		<>
			<H1 size="medium" className={style.textCenter}>
				{m.login_title()}
			</H1>
			<Form
				onSubmit={handleSubmit}
				className={style.form}
				disabled={isPending}
			>
				<label className={style.label} htmlFor="email">
					<Input
						label={m.login_email()}
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
							label={m.login_password()}
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
						{m.login_forgot_password()}
					</Link>
				</div>
				<ErrorText>{error?.message}</ErrorText>
				<Button type="submit">{m.login_submit()}</Button>
			</Form>
		</>
	);
}
