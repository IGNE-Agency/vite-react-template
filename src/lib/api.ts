import { QueryClient } from "@tanstack/react-query";
import env from "env";
import { installFakeApi } from "./fake-api";
import { client } from "./heyapi/client.gen";

// While these defaults are defined to work with
// most of our projects, you might want to edit
// these based on your specific needs.

client.setConfig({
	baseUrl: env.apiBaseUrl,
	headers: {
		Accept: "application/json",
		ContentType: "application/json",
	},
});

if (env.fakeApi) {
	installFakeApi(client);
}

const FIVE_MINUTES = 5 * 60 * 1000;

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 0,
			gcTime: FIVE_MINUTES,
		},
	},
});
