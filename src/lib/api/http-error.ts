export class HttpError extends Error {
	constructor(
		public readonly status: number,
		public readonly statusText: string,
		public readonly url: string,
	) {
		super(`HTTP ${status} ${statusText}`);
		this.name = "HttpError";
	}

	get isUnauthorized() {
		return this.status === 401;
	}

	get isForbidden() {
		return this.status === 403;
	}

	get isClientError() {
		return this.status >= 400 && this.status < 500;
	}

	get isServerError() {
		return this.status >= 500;
	}
}
