import { type FormEvent, useState } from "react";
import type { Schema, ZodIssueBase } from "zod";

export type UseFormReturn<T> = ReturnType<
	typeof useForm<T>
>;

type PromiseOr<T> = Promise<T> | T;

const useForm = <T>(schema: Schema<T>) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [issues, setIssues] =
		useState<ReadonlyArray<ZodIssueBase>>();

	const handleSubmit =
		(
			handler: (
				data: T,
			) => PromiseOr<
				ReadonlyArray<ZodIssueBase> | undefined | void
			>,
		) =>
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			setIsSubmitting(true);
			setIssues(undefined);

			try {
				const formData = new FormData(event.currentTarget);
				// biome-ignore lint/suspicious/noExplicitAny: unknown wouldn't work.
				const data: Record<string, any> = {};
				for (const [key, value] of formData.entries()) {
					if (!(key in data)) {
						data[key] = value;
					} else {
						if (!Array.isArray(data[key])) {
							data[key] = [data[key]];
						}
						data[key].push(value);
					}
				}
				const result = await schema.safeParseAsync(data);

				if (!result.success) {
					setIssues(result.error.issues);
				} else {
					const errors = await handler(result.data);
					if (errors) {
						setIssues(errors);
					}
				}
			} finally {
				setIsSubmitting(false);
			}
		};

	const invalidFields =
		issues &&
		Object.keys(
			Object.groupBy(issues, (issue) =>
				issue.path.join("."),
			),
		);

	return {
		isSubmitting,
		handleSubmit,
		invalidFields,
		issues,
	};
};

export default useForm;
