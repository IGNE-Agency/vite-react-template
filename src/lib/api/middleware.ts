import { TOKEN_NAME } from "lib/auth";
import { client } from "./heyapi/client.gen";
import { HttpError } from "./http-error";

export const applyMiddleware = () => {
	/**
	 * Include token in api calls, if available
	 */
	client.interceptors.request.use((request) => {
		let token = null;
		try {
			token = JSON.parse(
				window?.localStorage.getItem(TOKEN_NAME) || "null",
			);
		} catch {}

		request.headers.set("Authorization", `Bearer ${token}`);
		return request;
	});

	/**
	 * Re-throw non-2xx responses as HttpError so callers can branch on status codes
	 */
	client.interceptors.response.use((response) => {
		if (!response.ok) {
			throw new HttpError(response.status, response.statusText, response.url);
		}
		return response;
	});
};
