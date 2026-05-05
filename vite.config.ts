import * as path from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { patchCssModules } from "vite-css-modules";
import https from "vite-plugin-mkcert";
import svgr from "vite-plugin-svgr";
import viteTsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [
			tanstackRouter({
				routesDirectory: "./src/routes",
				autoCodeSplitting: true,
			}),
			https(),
			react({
				babel: { plugins: ["babel-plugin-react-compiler"] },
			}),
			viteTsConfigPaths(),
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
			// While Vite should automatically handle SASS, it has some problems with modules.
			// This plugin fixes the issue as the PR isn't ready yet.
			// https://github.com/vitejs/vite/pull/16018
			// As a small bonus, it generates types for us :)
			patchCssModules({
				generateSourceTypes: true,
			}),
		],
		css: {
			modules: {
				localsConvention: "camelCase",
			},
		},
		build: {
			target: "esnext",
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes("/node_modules/react/") || id.includes("/node_modules/react-dom/") || id.includes("/node_modules/scheduler/")) {
							return "vendor-react";
						}
						if (id.includes("/node_modules/@tanstack/react-router") || id.includes("/node_modules/@tanstack/router-core") || id.includes("/node_modules/@tanstack/history")) {
							return "vendor-router";
						}
						if (id.includes("/node_modules/@tanstack/react-query") || id.includes("/node_modules/@tanstack/query-core")) {
							return "vendor-query";
						}
						if (id.includes("/node_modules/i18next") || id.includes("/node_modules/react-i18next")) {
							return "vendor-i18n";
						}
					},
				},
			},
		},
		resolve: {
			// vite-tsconfig-paths doesn't work in SASS files
			alias: [
				{
					find: /^style\/(.*\.(c|s[ac])ss$)/,
					replacement: `${path.resolve(__dirname)}/src/style/$1`,
				},
			],
		},
		server: {
			open: true,
			proxy: {
				[env.VITE_API_BASEURL]: {
					target: "CHANGE_ME",
					secure: true,
					changeOrigin: true,
				},
			},
		},
	};
});
