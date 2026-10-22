import * as z from "zod";

const envSchema = z
	.object({
		// Empty: call the API on the hostname the app runs on, through the
		// proxy (or the Vite dev server). Only set it for a backend on another
		// hostname, without the path: the API paths already start with /api.
		VITE_API_BASEURL: z.string().default(""),
		// Answers login, logout and the current user in the browser, for working
		// on the frontend without a backend. See lib/fake-api.ts.
		VITE_FAKE_API: z.stringbool().default(false),
	})
	.transform((vars) => ({
		apiBaseUrl: vars.VITE_API_BASEURL,
		fakeApi: vars.VITE_FAKE_API,
	}));

const env = envSchema.parse(import.meta.env);

export default env;
export type Env = z.infer<typeof envSchema>;
