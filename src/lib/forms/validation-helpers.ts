import { parseErrorString } from "lib/api/error-helpers";
import { zValidationError } from "lib/heyapi/zod.gen";

/**
 * Field errors can be of multiple types. This transforms to an array of strings.
 * TODO: make sure this can handle the error types for your project
 */
export const normalizeFieldErrors = (
	errors: unknown,
): string[] => {
	const errorArray = Array.isArray(errors)
		? errors
		: [errors];
	return errorArray.flatMap((error) => {
		if (typeof error === "string") return [error];
		if (
			typeof error === "object" &&
			"message" in error &&
			typeof error.message === "string"
		)
			return [error.message];
		return [];
	});
};

/**
 * Returns a flattened array of error from given fields
 */
export const getFieldErrors = <
	TState extends {
		fieldMeta: Record<
			string,
			{ errors: unknown } | undefined
		>;
	},
	TField extends keyof TState["fieldMeta"],
>(
	state: TState,
	fields: TField[],
): string[] =>
	fields.flatMap((field) =>
		normalizeFieldErrors(state.fieldMeta[field]?.errors),
	);

/**
 * Backend uses snake_case, this converts to camelCase
 */
const snakeCaseToCamelCase = (string: string) => {
	return string.replace(/_([a-z])/g, (_, letter) =>
		letter.toUpperCase(),
	);
};

/**
 * Transform api error to form error.
 * TODO: check api error type for your project and adjust as necessary
 *       the template assumes rfc9457: https://datatracker.ietf.org/doc/html/rfc9457#name-the-problem-details-json-ob
 */
export const apiErrorToFormErrors = (error: unknown) => {
	const parsed = zValidationError.safeParse(error);
	if (parsed.success) {
		return {
			form: parsed.data.title,
			fields: Object.fromEntries(
				parsed.data.errors?.map(({ path, detail }) => [
					snakeCaseToCamelCase(path),
					detail,
				]) || [],
			),
		};
	}
	return { form: parseErrorString(error) };
};

// Instead of using `UseMutationResult` we use this custom type, so it
// can be used by other means than react-query and is easier to mock.
type Mutatable<TVariables> = {
	mutateAsync: (variables: TVariables) => Promise<unknown>;
};

/**
 * Connect TanStack Form with -Query to handle backend errors.
 * This is a temporary solution until TSF supports it out of the box:
 *   https://github.com/TanStack/form/issues/2188
 *
 * @example
 * validators: {
 *   onSubmitAsync: mutateAndValidate(mutation),
 * }
 */
export const mutateAndValidate =
	<TVariables>(mutation: Mutatable<TVariables>) =>
	async ({ value }: { value: TVariables }) => {
		try {
			await mutation.mutateAsync(value);
		} catch (error) {
			return apiErrorToFormErrors(error);
		}
	};
