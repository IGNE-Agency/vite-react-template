import { ZodIssue, z } from "zod";

// biome-ignore lint/suspicious/noConstEnum: We know what we're doing.
export const enum HttpStatus {
	// Success
	Ok = 200,

	// Client errors
	BadRequest = 400,

	// Server errors
	InternalServerError = 500,
}

type Result<T, E> = Success<T> | Failure<E>;

type Success<T> = Readonly<{
	ok: true;
	data: T;
}>;

type Failure<E> = Readonly<{
	ok: false;
	error: E;
}>;

type BadRequestResponse<T extends {}> = Readonly<{
	code: HttpStatus.BadRequest;
	errors: Readonly<Partial<Record<keyof T, ReadonlyArray<string>>>>;
}>;

type InternalServerErrorResponse = Readonly<{
	code: HttpStatus.InternalServerError;
	message: string;
}>;

export const roles = ["user", "admin"] as const;
export const RoleSchema = z.enum(roles);
export type Role = z.infer<typeof RoleSchema>;

export const UserDTOSchema = z.object({
	id: z.string().uuid(),
	email: z.string().nonempty(),
	name: z.string().nonempty(),
	role: RoleSchema,
});
export type UserDTO = z.infer<typeof UserDTOSchema>;

const AuthenticationSchema = z.object({
	exp: z.number().int(),
});
export type Authentication = z.infer<typeof AuthenticationSchema>;

// This is how api code should be generated
export const LoginRequestSchema = z
	.object({
		email: z.string().nonempty(),
		password: z.string().nonempty(),
	})
	.readonly();
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/**
 * This is a fake method. It only succeeds 50% of the time to
 * simulate possible errors you might encounter in the real world.
 *
 * If ok, this method returns a `UserDTO`.
 *
 * If not ok, this method returns either:
 * - A `BadRequestResponse<T>` which describes what errors occured
 *   per field of the input type `T`.
 * - An `InternalServerErrorResponse` which indicates that something
 *   unexpectedly went wrong.
 *
 * You can handle these response types individually by `switch`ing over
 * the `type` of either response. Typescript will figure out which type
 * you're working with.
 */
export const Login = async (
	data: LoginRequest,
): Promise<
	Result<
		UserDTO,
		BadRequestResponse<LoginRequest> | InternalServerErrorResponse
	>
> => {
	await new Promise((res) => setTimeout(res, 1000));

	if (!data.email || !data.password) {
		const errors: Partial<Record<keyof LoginRequest, string[]>> = {};
		if (!data.email) {
			errors.email = [`Field "email" is required.`];
		}
		if (!data.password) {
			errors.password = [`Field "password" is required.`];
		}
		return {
			ok: false,
			error: { code: HttpStatus.BadRequest, errors },
		};
	}
	const ok = !!Math.round(Math.random());

	if (ok) {
		return {
			ok,
			data: {
				id: globalThis.crypto.randomUUID(),
				email: data.email,
				name: "User Name",
				role: roles[Math.floor(Math.random() * (roles.length - 1))],
			},
		};
	}

	return {
		ok,
		error: {
			code: HttpStatus.InternalServerError,
			message: "Something went wrong. Please try again later.",
		},
	};
};

// This is how api code should be generated
export const RequestNewPasswordRequestSchema = z.object({
	email: z.string().nonempty(),
});
export type RequestNewPasswordRequest = z.infer<
	typeof RequestNewPasswordRequestSchema
>;

/**
 * This is a fake method. It only succeeds 50% of the time to
 * simulate possible errors you might encounter in the real world.
 *
 * If ok, this method returns `null`.
 *
 * If not ok, this method returns either:
 * - A `BadRequestResponse<T>` which describes what errors occured
 *   per field of the input type `T`.
 * - An `InternalServerErrorResponse` which indicates that something
 *   unexpectedly went wrong.
 *
 * You can handle these response types individually by `switch`ing over
 * the `type` of either response. Typescript will figure out which type
 * you're working with.
 */
export const RequestNewPassword = async (
	data: RequestNewPasswordRequest,
): Promise<
	Result<
		null,
		BadRequestResponse<RequestNewPasswordRequest> | InternalServerErrorResponse
	>
> => {
	await new Promise((res) => setTimeout(res, 1000));

	if (!data.email) {
		const errors: Partial<Record<keyof RequestNewPasswordRequest, string[]>> =
			{};
		if (!data.email) {
			errors.email = [`Field "email" is required.`];
		}
		return {
			ok: false,
			error: { code: HttpStatus.BadRequest, errors },
		};
	}
	const ok = !!Math.round(Math.random());

	if (ok) {
		return {
			ok,
			data: null,
		};
	}

	return {
		ok,
		error: {
			code: HttpStatus.InternalServerError,
			message: "Something went wrong. Please try again later.",
		},
	};
};

// This is how api code should be generated
export const RegisterRequestSchema = z.object({
	email: z.string().nonempty(),
	name: z.string().nonempty(),
	role: RoleSchema,
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

/**
 * This is a fake method. It only succeeds 50% of the time to
 * simulate possible errors you might encounter in the real world.
 *
 * If ok, this method returns the newly created `UserDTO`.
 *
 * If not ok, this method returns either:
 * - A `BadRequestResponse<T>` which describes what errors occured
 *   per field of the input type `T`.
 * - An `InternalServerErrorResponse` which indicates that something
 *   unexpectedly went wrong.
 *
 * You can handle these response types individually by `switch`ing over
 * the `type` of either response. Typescript will figure out which type
 * you're working with.
 */
export const Register = async (
	data: RegisterRequest,
): Promise<
	Result<
		UserDTO,
		BadRequestResponse<RegisterRequest> | InternalServerErrorResponse
	>
> => {
	await new Promise((res) => setTimeout(res, 1000));

	if (!data.email) {
		const errors: Partial<Record<keyof RegisterRequest, string[]>> = {};
		if (!data.email) {
			errors.email = [`Field "email" is required.`];
		}
		if (!data.name) {
			errors.name = [`Field "name" is required.`];
		}
		if (!data.role) {
			errors.role = [`Field "role" is required.`];
		}
		return {
			ok: false,
			error: { code: HttpStatus.BadRequest, errors },
		};
	}
	const ok = !!Math.round(Math.random());

	if (ok) {
		return {
			ok,
			data: {
				id: globalThis.crypto.randomUUID(),
				...data,
			},
		};
	}

	return {
		ok,
		error: {
			code: HttpStatus.InternalServerError,
			message: "Something went wrong. Please try again later.",
		},
	};
};

export const RequestOneTimePasswordRequestSchema = z
	.object({ email: z.string().nonempty() })
	.readonly();
type RequestOneTimePasswordRequest = z.infer<
	typeof RequestOneTimePasswordRequestSchema
>;

const RequestOneTimePasswordResponseSchema = z
	.object({
		message: z.string(),
	})
	.readonly();
type RequestOneTimePasswordResponse = z.infer<
	typeof RequestOneTimePasswordResponseSchema
>;

/**
 * sdfghjdsfdfghdfgh
 */
export const RequestOneTimePassword = async (
	data: RequestOneTimePasswordRequest,
): Promise<Result<RequestOneTimePasswordResponse, ReadonlyArray<ZodIssue>>> => {
	const response = await fetch("/api/code", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json", Accept: "application/json" },
	});

	if (!response.ok) {
		return {
			ok: false,
			error: [
				{
					code: "custom",
					message: "Something went wrong",
					path: ["*"],
				},
			],
		};
	}

	const parseResult = RequestOneTimePasswordResponseSchema.safeParse(
		await response.json(),
	);

	if (!parseResult.success) {
		return { ok: false, error: parseResult.error.issues };
	}

	return { ok: true, data: parseResult.data };
};
