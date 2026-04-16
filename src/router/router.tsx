import type { QueryClient } from "@tanstack/react-query";
import {
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { useAuth } from "lib/auth";
import { routeTree } from "../routeTree.gen";

export interface RouterContext {
	queryClient: QueryClient;
	token: string | null | undefined;
}

const router = createRouter({
	routeTree,
	context: {
		// biome-ignore lint/style/noNonNullAssertion: will immediately get instantiated
		queryClient: null!,
		token: null,
	},
	defaultPreload: "intent",
});

export const AppRouter = ({
	queryClient,
}: {
	queryClient: QueryClient;
}) => {
	const [token] = useAuth();
	return (
		<RouterProvider
			router={router}
			context={{ queryClient, token }}
		/>
	);
};

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
