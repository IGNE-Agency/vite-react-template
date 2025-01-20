import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import viteTsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), viteTsConfigPaths(), svgr()],
	server: {
		open: true,
		proxy: {
			"/api": "CHANGE_ME",
			"/oauth2": "CHANGE_ME"
		}
	}
});
