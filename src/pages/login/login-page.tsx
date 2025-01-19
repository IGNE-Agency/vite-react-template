import {
	HttpStatus,
	LoginRequest,
	api
} from "lib/api";
import { useAppState } from "lib/app-state";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Location, useLocation } from "react-router";

// This module extension enables `useLocation.state` to be typed
declare module "react-router" {
	export function useLocation<T>(): Location<T>;
}

const LoginPage = () => {
	const {
		state: { redirect }
	} = useLocation<{ redirect?: string }>();
	const { t } = useTranslation();
	const [isSubmitting, setIsSubmitting] =
		useState(false);
	const [, dispatch] = useAppState();

	const handleSubmit = async (
		e: FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		const data = Object.fromEntries(
			new FormData(e.currentTarget).entries()
		) as LoginRequest;
		const result = await api.Login(data);

		if (result.ok) {
			dispatch({ type: "login", user: result.data });
		} else {
			switch (result.error.code) {
				case HttpStatus.BadRequest: {
					form.serverError(result.error.errors);
					break;
				}
				case HttpStatus.Forbidden: {
					form.serverError({
						type: "custom",
						message: result.error.message
					});
					break;
				}
			}
		}
	};

	return (
		<>
			<h1>{t("pages.login.title")}</h1>
			<form onSubmit={handleSubmit}>
				<fieldset disabled={isSubmitting}>
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
				</fieldset>
			</form>
		</>
	);
};

export default LoginPage;
