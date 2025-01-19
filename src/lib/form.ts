import { FormEvent, useState } from "react";
import { type ZodIssue } from "zod";

type FormIssues = Readonly<
	Record<string, ReadonlyArray<ZodIssue>>
>;

export type UseFormReturn<T> = ReturnType<
	typeof useForm<T>
>;

const useForm = <T>() => {
	const [isSubmitting, setIsSubmitting] =
		useState(false);
	const [issues, setIssues] = useState<FormIssues>();

	const handleSubmit =
		(handler: (data: T) => void | Promise<void>) =>
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const data = Object.fromEntries(
				new FormData(event.currentTarget).entries()
			) as T;

			setIsSubmitting(true);
			setIssues(undefined);
			try {
				await handler(data);
			} catch (error) {
				if (isServerError(error)) {
					// TODO: Implement
					throw new Error("Not implemented.");
				} else if (isZodIssue(error)) {
					addIssue(error);
				}
			} finally {
				setIsSubmitting(false);
			}
		};

	const addIssue = (issue: ZodIssue) => {
		// TODO: Implement
		throw new Error("Not implemented.");
	};

	return {
		isSubmitting,
		handleSubmit,
		addIssue,
		issues
	};
};

export default useForm;

type ServerError = Readonly<{
	code: number;
}>;

const isServerError = (
	error: any
): error is ServerError =>
	error &&
	"code" in error &&
	typeof error.code === "number";

const isZodIssue = (error: any): error is ZodIssue =>
	error &&
	"code" in error &&
	typeof error.code === "string";
