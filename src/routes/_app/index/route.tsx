import { createFileRoute } from "@tanstack/react-router";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { H1 } from "components/heading/heading";
import { useTranslation } from "react-i18next";
import style from "./-index.module.scss";

export const Route = createFileRoute("/_app/")({
	component: HomePage,
});

function HomePage() {
	const { t } = useTranslation();
	useDocumentTitle(t("pages.home.title"));

	return (
		<div className={style.page}>
			<H1 size="medium">{t("pages.home.title")}</H1>
		</div>
	);
}
