import {
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import env from "env";
import type { ReactNode } from "react";
import { client } from "./heyapi/client.gen";
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
				// TODO: Use interceptor to re-throw as `HttpError`, including the status code. That is way better than message sniffing.
				if (
					error.message
						.toLowerCase()
						.startsWith("unauthenticated")
				) {
					return false;
				}
				return fails < 3;
			},
		},
	},
});

export const TanstackQueryProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};
