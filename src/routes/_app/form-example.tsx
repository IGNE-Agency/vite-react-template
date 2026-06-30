import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ErrorText } from "components/error-text/error-text";
import { Button, Form } from "components/form";
import formStyle from "components/form/form.module.scss";
import { H1 } from "components/heading/heading";
import { useAppForm } from "lib/forms";
import {
	getFieldErrors,
	mutateAndValidate,
} from "lib/forms/validation-helpers";
import type { ValidationError } from "lib/heyapi";
import { makePageTitle } from "lib/title";
import z from "zod";
import style from "./form-example.module.scss";

const validationSchema = z.object({
	email: z.email(),
	postalCode: z.string().regex(/\d{4}\s?[a-zA-Z]{2}/, {
		error: "Vul een geldige postcode in",
	}),
	houseNumber: z.string().regex(/\d+/),
	houseNumberAdd: z.string(),
	agree: z.literal<boolean>(true),
	options: z.array(z.string()),
});
type ValidationType = z.infer<typeof validationSchema>;

// biome-ignore lint/suspicious/noExplicitAny: whatever man
const fakeSubmit = async (_value: any, ok = true) =>
	new Promise((resolve, reject) =>
		setTimeout(() => {
			if (ok) {
				resolve({ message: "Success" });
			} else {
				reject({
					type: "ValidationError",
					title: "There was an issue with your input",
					errors: [
						// -- Try out errors on these fields
						// {
						// 	path: "email",
						// 	detail: "This email already exists",
						// },
						{
							path: "postal_code",
							detail:
								"Could not find an address with the data you supplied",
						},
					],
				} satisfies ValidationError);
			}
		}, 500),
	);

// ---

export const Route = createFileRoute("/_app/form-example")({
	head: () => ({
		meta: [{ title: makePageTitle("Form test") }],
	}),
	component: FormTest,
});

function FormTest() {
	const mutation = useMutation({
		mutationFn: (value: ValidationType) =>
			fakeSubmit(value, false),
		onSuccess: () => {
			// biome-ignore lint/suspicious/noConsole: DEV
			console.log("Success!");
		},
	});

	const defaultValues: ValidationType = {
		email: "test@test.nl",
		postalCode: "1234AZ",
		houseNumber: "123",
		houseNumberAdd: "",
		agree: false,
		options: [],
	};

	const form = useAppForm({
		defaultValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: validationSchema,
			onSubmitAsync: mutateAndValidate(mutation),
		},
	});

	return (
		<div className={style.page}>
			<H1 size="medium">Form example</H1>

			<Form
				className={formStyle.form}
				onSubmit={(evt) => {
					evt.preventDefault();
					form.handleSubmit();
				}}
				disabled={mutation.isPending}
			>
				<form.AppField name="email">
					{(field) => (
						<field.Input
							label="Your e-mail"
							autoComplete="email"
						/>
					)}
				</form.AppField>

				{/*
				  Good candidate to use with `withFieldGroup`:
				  https://tanstack.com/form/latest/docs/framework/solid/guides/form-composition#reusing-groups-of-fields-in-multiple-forms
				*/}
				<div className={style.address}>
					<form.AppField name="postalCode">
						{(field) => (
							<field.Input label="Postal code" noError />
						)}
					</form.AppField>
					<form.AppField name="houseNumber">
						{(field) => (
							<field.Input label="House number" noError />
						)}
					</form.AppField>
					<form.AppField name="houseNumberAdd">
						{(field) => (
							<field.Input label="Addition" noError />
						)}
					</form.AppField>
					<form.Subscribe
						selector={(state) =>
							getFieldErrors(state, [
								"postalCode",
								"houseNumber",
								"houseNumberAdd",
							])
						}
					>
						{(errors) =>
							errors.length > 0 ? (
								<ErrorText className={style.addressError}>
									{errors}
								</ErrorText>
							) : null
						}
					</form.Subscribe>
				</div>

				<form.AppField name="agree">
					{(field) => (
						<field.Checkbox label="I agree with whatever dude." />
					)}
				</form.AppField>

				<Button type="submit">Submit</Button>
			</Form>
		</div>
	);
}
