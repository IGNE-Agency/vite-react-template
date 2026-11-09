import { heyApiPlugin } from "@hey-api/vite-plugin";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import https from "vite-plugin-mkcert";
import svgr from "vite-plugin-svgr";
import packageJson from "./package.json" with { type: "json" };
import inlangSettings from "./project.inlang/settings.json" with { type: "json" };
import { translatedPathnames } from "./router-i18n.ts";

/**
 * Serves the document in the locale paraglide compiles for, read from the
 * settings file rather than repeated in `index.html` so the two cannot disagree.
 */
const documentLocale = () => ({
	name: "document-locale",
	transformIndexHtml: (html: string) =>
		html.replaceAll("%LOCALE%", inlangSettings.baseLocale),
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [
			paraglideVitePlugin({
				project: "./project.inlang",
				outdir: "./src/lib/paraglide",
				strategy: ["url", "localStorage", "baseLocale"],
				emitTsDeclarations: true,
				urlPatterns: translatedPathnames,
				localStorageKey: `${packageJson.name}-lang`,
			}),
			documentLocale(),
			heyApiPlugin({
				config: {
					input: "./openapi.yaml",
					output: "src/lib/heyapi",
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
			}),
			tanstackRouter({
				autoCodeSplitting: true,
				quoteStyle: "double",
				semicolons: true,
				routeFileIgnorePattern: "\\.module\\.scss",
			}),
			https(),
			react({ compiler: true }),
			svgr({
				svgrOptions: {
					plugins: [
						"@svgr/plugin-svgo",
						"@svgr/plugin-jsx",
					],
					// svgProps: { fill: "currentColor" }, // enable this with caution, wether it works depends on the icon set used
					svgoConfig: {
						multipass: true,
						floatPrecision: 1,
						plugins: [
							{
								name: "preset-default",
								params: {
									overrides: {
										removeViewBox: false,
									},
								},
							},
						],
					},
				},
			}),
		],
		css: {
			modules: {
				localsConvention: "camelCase",
			},
		},
		build: {
			target: "esnext",
			rolldownOptions: {
				output: {
					codeSplitting: {
						groups: [
							{
								name: "vendor-react",
								test: /\/node_modules\/(react|react-dom|scheduler)\//,
							},
							{
								name: "vendor-router",
								test: /\/node_modules\/@tanstack\/(react-router|router-core|history)\//,
							},
							{
								name: "vendor-query",
								test: /\/node_modules\/@tanstack\/(react-query|query-core)\//,
							},
							{
								name: "vendor-i18n",
								test: /\/node_modules\/(i18next|react-i18next)\//,
							},
						],
					},
				},
			},
		},
		resolve: {
			tsconfigPaths: true,
			// tsconfig paths don't apply to Sass imports
			alias: [
				{
					find: /^style\/(.*\.(c|s[ac])ss$)/,
					replacement: `${import.meta.dirname}/src/style/$1`,
				},
			],
		},
		server: {
			open: true,
			proxy: {
				[env.VITE_API_BASEURL]: {
					// TODO: Change to your actual backend
					target: "CHANGE_ME",
					secure: true,
					changeOrigin: true,
				},
			},
		},
	};
});
