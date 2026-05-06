import {
	createRootRouteWithContext,
	Outlet,
} from "@tanstack/react-router";
import { H1 } from "components/heading/heading";
import type { RouterContext } from "lib/router";
import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "usehooks-ts";
import style from "./not-found.module.scss";

const NotFoundPage = () => {
	const { t } = useTranslation();
	useDocumentTitle(t("pages.notFound.title"));

	return (
		<H1 size="medium" className={style.page}>
			{t("pages.notFound.title")}
		</H1>
	);
};

export const Route =
	createRootRouteWithContext<RouterContext>()({
		component: () => <Outlet />,
		notFoundComponent: NotFoundPage,
	});
