import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig([
	{
		input: "./openapi.json", // replace with url to openapi spec
		output: "src/lib/api/heyapi",
		plugins: [
			"@hey-api/typescript",
			"@tanstack/react-query",
			{
				name: "@hey-api/sdk",
				// validator: true, // optional: https://heyapi.dev/openapi-ts/plugins/sdk#validators
			},
			"zod",
		],
	},
]);
