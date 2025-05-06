import {
	type ClientOptions,
	default as createClient,
	default as createFetchClient,
} from "openapi-fetch";
import { default as createQueryClient } from "openapi-react-query";
import type { paths } from "./schema.gen";

const options: ClientOptions = {
	baseUrl: "https://localhost:5173",
};

export const queryClient = createQueryClient(
	createFetchClient<paths>(options),
);

export const client = createClient<paths>(options);
