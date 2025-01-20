import { type FormEvent, useState } from "react";
import type { Schema, ZodIssue } from "zod";

export type UseFormReturn<T> = ReturnType<
	typeof useForm<T>
>;

const useForm = <T>(schema: Schema<T>) => {
	const [isSubmitting, setIsSubmitting] =
		useState(false);
	const [issues, setIssues] =
		useState<ReadonlyArray<ZodIssue>>();

	const handleSubmit =
		(handler: (data: T) => void | Promise<void>) =>
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			setIsSubmitting(true);
			setIssues(undefined);

			const result = await schema.safeParseAsync(
				Object.fromEntries(
					new FormData(event.currentTarget).entries()
				)
			);

			if (!result.success) {
				setIssues(result.error.issues);
			} else {
				try {
					await handler(result.data);
				} catch (error) {
					if (!isServerError(error)) {
						throw error;
					}
					for (const [
						field,
						messages
					] of Object.entries(error.errors)) {
						issue(
							messages.map(message => ({
								code: "custom",
								path: [field],
								message
							}))
						);
					}
				}
			}

			setIsSubmitting(false);
		};

	const issue = (issues: ReadonlyArray<ZodIssue>) => {
		setIssues(oldIssues =>
			(oldIssues ?? []).concat(issues)
		);
	};

	const addIssues = (
		messages: ReadonlyArray<string>
	) => issue(messages.map(createCustomIssue));

	return {
		isSubmitting,
		handleSubmit,
		addIssues,
		issues
	};
};

export default useForm;

const createCustomIssue = (
	message: string
): ZodIssue => ({
	code: "custom",
	path: ["*"],
	message
});

type ServerError = Readonly<{
	code: number;
	errors: Readonly<
		Record<string, ReadonlyArray<string>>
	>;
}>;

const isServerError = (
	error: any
): error is ServerError =>
	error &&
	"code" in error &&
	typeof error.code === "number" &&
	"errors" in error &&
	typeof error.errors === "object";

const isZodIssue = (error: any): error is ZodIssue =>
	error &&
	"code" in error &&
	typeof error.code === "string";
