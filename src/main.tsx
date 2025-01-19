import { AppStateProvider } from "lib/app-state";
import * as i18n from "lib/i18n";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "router";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error(
		"Something has gone terribly wrong. The app couldn't find its home :("
	);
}

await i18n.init();

const root = createRoot(rootElement);

root.render(
	<StrictMode>
		<AppStateProvider>
			<Router />
		</AppStateProvider>
	</StrictMode>
);
