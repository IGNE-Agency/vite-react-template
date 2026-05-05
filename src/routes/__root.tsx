import {
	createRootRouteWithContext,
	Outlet,
} from "@tanstack/react-router";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { H1 } from "components/heading/heading";
import type { RouterContext } from "lib/router";
import * as m from "paraglide/messages";
import style from "./-not-found.module.scss";

const NotFoundPage = () => {
	useDocumentTitle(m.not_found_title());

	return (
		<H1 size="medium" className={style.page}>
			{m.not_found_title()}
		</H1>
	);
};

export const Route =
	createRootRouteWithContext<RouterContext>()({
		component: () => <Outlet />,
		notFoundComponent: NotFoundPage,
	});
