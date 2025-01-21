import { type FormEvent, useState } from "react";
import type { Schema, ZodIssue } from "zod";

export type UseFormReturn<T> = ReturnType<
	typeof useForm<T>
>;

type FormErrors = Readonly<
	Record<string, readonly string[]>
>;

type PromiseOr<T> = Promise<T> | T;

const useForm = <T>(schema: Schema<T>) => {
	const [isSubmitting, setIsSubmitting] =
		useState(false);
	const [issues, setIssues] =
		useState<ReadonlyArray<ZodIssue>>();

	const handleSubmit =
		(
			handler: (
				data: T
			) => PromiseOr<FormErrors | undefined>
		) =>
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
				const error = await handler(result.data);
				if (error) {
					setIssues(
						Object.entries(error).flatMap(
							([field, messages]) =>
								messages.map(message => ({
									code: "custom",
									path: [field],
									message
								}))
						)
					);
				}
			}

			setIsSubmitting(false);
		};

	return {
		isSubmitting,
		handleSubmit,
		invalidFields:
			issues &&
			Object.keys(
				Object.groupBy(issues, issue =>
					issue.path.join(".")
				)
			),
		issues
	};
};

export default useForm;
