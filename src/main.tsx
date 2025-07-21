import {
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import ErrorBoundary from "components/error-boundary/error-boundary";
import LoadingIndicator from "components/loading-indicator/loading-indicator";
import { AuthProvider } from "lib/auth";
import * as i18n from "lib/i18n";
import { PageTitleProvider } from "lib/page-title";
import ErrorPage from "pages/error/error-page";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import Router from "router/routes";
import "style/main.scss";

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
			<ErrorBoundary
				fallback={(error) => <ErrorPage error={error} />}
			>
				<Suspense fallback={<LoadingIndicator />}>
					<QueryClientProvider client={client}>
						<AuthProvider>
							<PageTitleProvider name="Template">
								<Router />
							</PageTitleProvider>
						</AuthProvider>
					</QueryClientProvider>
				</Suspense>
			</ErrorBoundary>
		</StrictMode>
	);
};

root.render(<App />);
