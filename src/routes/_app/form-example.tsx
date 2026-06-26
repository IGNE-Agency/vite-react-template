import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ErrorText } from "components/error-text/error-text";
import { Button, Form } from "components/form";
import { H1 } from "components/heading/heading";
import { useAppForm } from "lib/forms";
import { mutateAndValidate } from "lib/forms/submit-helpers";
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
	agree: z.boolean(),
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
						{
							path: "email",
							detail: "This email already exists",
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
			// biome-ignore lint/suspicious/noConsole: TODO: DEV
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
				onSubmit={(evt) => {
					evt.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.Subscribe
					selector={(state) => state.errorMap.onSubmit}
				>
					{(error) =>
						// TODO: Investigate error type -I expect an object with form and fields, why can it be string?
						error ? (
							typeof error === "string" ? (
								<ErrorText>1 {error}</ErrorText>
							) : (
								<ErrorText>2 {error.form}</ErrorText>
							)
						) : null
					}
				</form.Subscribe>
				<Button type="submit">Submit</Button>
			</Form>
		</div>
	);
}
