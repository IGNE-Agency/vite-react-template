import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { patchCssModules } from 'vite-css-modules';
import svgr from "vite-plugin-svgr";
import viteTsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		viteTsConfigPaths(),
		svgr(),
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
			localsConvention:"camelCase",
		},
	},
	server: {
		open: true,
		proxy: {
			"/api": "CHANGE_ME",
			"/oauth2": "CHANGE_ME",
		},
	}
});
