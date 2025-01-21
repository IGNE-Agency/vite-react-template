import { z } from "zod";

// biome-ignore lint/suspicious/noConstEnum: We know what we're doing.
export const enum HttpStatus {
	// Success
	Ok = 200,
	NoContent = 204,

	// Client errors
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,

	// Server errors
	InternalServerError = 500
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
	errors: Readonly<
		Partial<Record<keyof T, ReadonlyArray<string>>>
	>;
}>;

type ForbiddenResponse = Readonly<{
	code: HttpStatus.Forbidden;
	message: string;
}>;

export const roles = ["user", "admin"] as const;
export const RoleSchema = z.enum(roles);
export type Role = z.infer<typeof RoleSchema>;

export const UserDTOSchema = z.object({
	id: z.string().uuid(),
	email: z.string().nonempty(),
	name: z.string().nonempty(),
	role: RoleSchema
});
export type UserDTO = z.infer<typeof UserDTOSchema>;

const AuthenticationSchema = z.object({
	exp: z.number().int()
});
export type Authentication = z.infer<
	typeof AuthenticationSchema
>;

// This is how api code should be generated
export const LoginRequestSchema = z
	.object({
		email: z.string().nonempty(),
		password: z.string().nonempty()
	})
	.readonly();
export type LoginRequest = z.infer<
	typeof LoginRequestSchema
>;

export const api = {
	Login: async (
		data: LoginRequest
	): Promise<
		Result<
			UserDTO,
			| BadRequestResponse<LoginRequest>
			| ForbiddenResponse
		>
	> => {
		await new Promise(res => setTimeout(res, 1000));

		if (!data.email || !data.password) {
			const errors: Partial<
				Record<keyof LoginRequest, string[]>
			> = {};
			if (!data.email) {
				errors.email = [`Field "email" is required.`];
			}
			if (!data.password) {
				errors.password = [
					`Field "password" is required.`
				];
			}
			return {
				ok: false,
				error: { code: HttpStatus.BadRequest, errors }
			};
		}
		const ok = !!Math.round(Math.random());

		if (ok) {
			return {
				ok,
				data: {
					id: globalThis.crypto.randomUUID(),
					email: "user@example.com",
					name: "User Name",
					role: roles[
						Math.floor(
							Math.random() * (roles.length - 1)
						)
					]
				}
			};
		}

		return {
			ok,
			error: {
				code: HttpStatus.Forbidden,
				message:
					"We decided you're just not allowed to do this right now."
			}
		};
	}
};
