import {
	createFileRoute,
	redirect,
} from "@tanstack/react-router";
import AppLayout from "layouts/app/app-layout";

export const Route = createFileRoute("/_app")({
	beforeLoad: ({ context, location }) => {
		// TODO: replace with more flexible permission system: https://github.com/IGNE-Agency/vite-react-template/issues/43
		if (!context.token) {
			throw redirect({
				to: "/login",
				search: {
					// After logging in, send them back where they came from
					// but prevent setting it when it's "/"
					redirect:
						location.pathname !== "/"
							? location.pathname
							: undefined,
				},
			});
		}
	},
	component: AppLayout,
});
