import { QueryClient } from "@tanstack/react-query";
import env from "env";
import { client } from "./heyapi/client.gen";
import { HttpError } from "./http-error";
import { applyMiddleware } from "./middleware";

// Configure generated fetch client
// Note that auth token is set in middleware
client.setConfig({
	baseUrl: env.apiBaseUrl,
	headers: {
		Accept: "application/json",
		ContentType: "application/json",
	},
});
applyMiddleware();

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Can be adjusted per query
			staleTime: 0,
			gcTime: 5 * 60 * 1000, // 5 minutes
			retry: (fails, error) => {
				// Never retry client errors — they won't resolve on their own
				if (error instanceof HttpError && error.isClientError) {
					return false;
				}
				return fails < 3;
			},
		},
	},
});
