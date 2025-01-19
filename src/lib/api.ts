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
		return null as any;
	}
};
