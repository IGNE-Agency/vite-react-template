import { createFileRoute } from "@tanstack/react-router";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { H1 } from "components/heading/heading";
import * as m from "lib/paraglide/messages";
import style from "./index.module.scss";

export const Route = createFileRoute("/_app/")({
	component: HomePage,
});

function HomePage() {
	useDocumentTitle(m.home_title());

	return (
		<div className={style.page}>
			<H1 size="medium">{m.home_title()}</H1>
		</div>
	);
}
