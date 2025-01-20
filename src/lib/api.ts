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

export type Role = "user" | "admin";

export type User = Readonly<{
	email: string;
	name: string;
	role: Role;
}>;

export type Auth = Readonly<{
	exp: number;
}>;

type Result<T, E> = Success<T> | Failure<E>;

type Success<T> = Readonly<{
	ok: true;
	data: T;
}>;

type Failure<E> = Readonly<{
	ok: false;
	error: E;
}>;

export type LoginRequest = Readonly<{
	email: string;
	password: string;
}>;

type BadRequestResponse<T extends {}> = Readonly<{
	code: HttpStatus.BadRequest;
	errors: Readonly<
		Record<keyof T, ReadonlyArray<string>>
	>;
}>;

type ForbiddenResponse = Readonly<{
	code: HttpStatus.Forbidden;
	message: string;
}>;

export const api = {
	Login: async (
		data: LoginRequest
	): Promise<
		Result<
			User,
			| BadRequestResponse<LoginRequest>
			| ForbiddenResponse
		>
	> => {
		if (!data.email || !data.password) {
			const errors: Record<any, any> = {};
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
					email: "user@example.com",
					name: "User Name",
					role: (["user", "admin"] as const)[
						Math.floor(Math.random() * 2)
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
