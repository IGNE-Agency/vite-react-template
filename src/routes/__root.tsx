import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { H1 } from "components/heading/heading";
import * as m from "lib/paraglide/messages";
import type { RouterContext } from "lib/router";
import { buildTitle } from "lib/title";
import {
	FaviconManager,
	TitleManager,
	TitleStateProvider,
} from "lib/title-state";
import style from "./not-found.module.scss";

const NotFoundPage = () => (
	<>
		<title>{buildTitle(m.not_found_title())}</title>
		<H1 size="medium" className={style.page}>
			{m.not_found_title()}
		</H1>
	</>
);

export const Route =
	createRootRouteWithContext<RouterContext>()({
		component: () => (
			<TitleStateProvider>
				<HeadContent />
				<TitleManager />
				<FaviconManager />
				<Outlet />
			</TitleStateProvider>
		),
		notFoundComponent: NotFoundPage,
	});
