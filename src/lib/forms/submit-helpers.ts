import { parseErrorString } from "lib/api/error-helpers";
import { zValidationError } from "lib/heyapi/zod.gen";

const pascalCaseToSnakeCase = (string: string) => {
	return string
		.split(/\.?(?=[A-Z])/)
		.join("_")
		.toLowerCase();
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
					pascalCaseToSnakeCase(path),
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
