import * as z from "zod";

const envSchema = z
	.object({
		VITE_API_BASEURL: z.string().default(""),
		VITE_FAKE_API: z.stringbool().default(false),
	})
	.transform((vars) => ({
		apiBaseUrl: vars.VITE_API_BASEURL,
		fakeApi: vars.VITE_FAKE_API,
	}));

const env = envSchema.parse(import.meta.env);

export default env;
export type Env = z.infer<typeof envSchema>;
