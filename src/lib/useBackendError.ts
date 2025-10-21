import type { components } from "lib/schema.gen";
import { useCallback, useState } from "react";
import type { ZodCustomIssueWithMessage } from "react-zorm";
import { ZodIssueCode } from "zod";

/**
 * Discuss a generic error pattern with your backender and ask them to put it in the oauth schema.
 * Alternatively type it out manually.
 * Ideally there should be one error type for all endpoints.
 *
 * Example of laravel error json:
 * {
 * 	 // form field errors
 *   "errors": {
 * 			"name": ["Some issue"] // can be multiple, but zorm only supports one at a time,
 * 			"user.number": ["Some issue"] // nested fields are flattened by laravel
 *   },
 *   // generic error, unrelated to field
 *   "message": "Something went wrong"
 * }
 */
export type BackendError = components["schemas"]["Problem"];

const useBackendError = () => {
	const [backendErrors, setBackendErrors] = useState<{
		formIssues?: ZodCustomIssueWithMessage[];
		genericError?: string;
	}>({
		formIssues: undefined,
		genericError: undefined,
	});

	const handleErrors = useCallback(
		(backendError: BackendError | undefined) => {
			if (backendError === undefined) {
				setBackendErrors({
					formIssues: undefined,
					genericError: undefined,
				});
				return;
			}

			const formIssues = !backendError.errors
				? undefined
				: Object.entries(backendError.errors).map(
						([key, messages]) => ({
							code: ZodIssueCode.custom,
							path: key.split("."),
							message: messages[0],
						}),
					);

			setBackendErrors({
				formIssues,
				genericError: backendError.message,
			});
		},
		[],
	);

	return [backendErrors, handleErrors] as const;
};

export default useBackendError;
