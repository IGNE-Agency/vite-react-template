import { TOKEN_NAME } from "lib/auth";
import { client } from "./heyapi/client.gen";

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
};
