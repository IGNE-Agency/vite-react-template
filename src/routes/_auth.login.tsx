import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "pages/login/login-page";
import z from "zod";

const loginSearchSchema = z.object({
	redirect: z.optional(
		z.string().startsWith("/").catch("/"),
	),
});

export const Route = createFileRoute("/_auth/login")({
	validateSearch: loginSearchSchema,
	component: LoginPage,
});
