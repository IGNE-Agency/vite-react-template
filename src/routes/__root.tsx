import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	redirect,
	Scripts,
} from "@tanstack/react-router";
import { H1 } from "components/heading/heading";
import * as m from "lib/paraglide/messages";
import { shouldRedirect } from "lib/paraglide/runtime";
import type { RouterContext } from "lib/router";
import style from "./not-found.module.scss";

const NotFoundPage = () => (
	<H1 size="medium" className={style.page}>
		{m.not_found_title()}
	</H1>
);

export const Route =
	createRootRouteWithContext<RouterContext>()({
		beforeLoad: async () => {
			const decision = await shouldRedirect({
				url: window.location.href,
			});
			if (decision.redirectUrl) {
				throw redirect({ href: decision.redirectUrl.href });
			}
		},
		component: () => (
			<>
				<HeadContent />
				<Outlet />
				<Scripts />
			</>
		),
		notFoundComponent: NotFoundPage,
	});
