import {
	createRootRouteWithContext,
	Outlet,
} from "@tanstack/react-router";
import NotFoundPage from "pages/not-found/not-found-page";
import type { RouterContext } from "router/router";

export const Route =
	createRootRouteWithContext<RouterContext>()({
		component: () => <Outlet />,
		notFoundComponent: NotFoundPage,
	});
