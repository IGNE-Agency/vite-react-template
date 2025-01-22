import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Spinner from "assets/icons/spinner.svg?react";
import ErrorBoundary from "components/error-boundary/error-boundary";
import { AppStateProvider } from "lib/app-state";
import * as i18n from "lib/i18n";
import { PageTitleProvider } from "lib/page-title";
import ErrorPage from "pages/error/error-page";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import Router from "router";
import "style/reset.scss";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error(
		"Something has gone terribly wrong. The app couldn't find its home :(",
	);
}

await i18n.init();

const root = createRoot(rootElement);

const client = new QueryClient();

const App = () => {
	i18n.useSyncHtmlLangAttribute();

	return (
		<StrictMode>
			<ErrorBoundary fallback={(error) => <ErrorPage error={error} />}>
				<Suspense fallback={<Spinner />}>
					<QueryClientProvider client={client}>
						<AppStateProvider>
							<PageTitleProvider name="BOTS">
								<Router />
							</PageTitleProvider>
						</AppStateProvider>
					</QueryClientProvider>
				</Suspense>
			</ErrorBoundary>
		</StrictMode>
	);
};

root.render(<App />);
