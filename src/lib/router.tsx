import type { QueryClient } from "@tanstack/react-query";
import {
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { queryClient } from "lib/api";
import {
	deLocalizeUrl,
	localizeUrl,
} from "lib/paraglide/runtime";
import { routeTree } from "../routeTree.gen";

export type RouterContext = Readonly<{
	queryClient: QueryClient;
}>;

const router = createRouter({
	routeTree,
	context: { queryClient },
	defaultPreload: "intent",
	rewrite: {
		input: ({ url }) => deLocalizeUrl(url),
		output: ({ url }) => localizeUrl(url),
	},
});

export const AppRouter = () => (
	<RouterProvider router={router} />
);

declare module "@tanstack/react-router" {
	// oxlint-disable-next-line typescript/consistent-type-definitions -- module augmentation merges into an interface
	interface Register {
		router: typeof router;
	}
}
