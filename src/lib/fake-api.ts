import type { Client } from "./heyapi/client";

const COOKIE = "FAKE_AUTH";

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

const empty = () => new Response(null, { status: 204 });

/**
 * Answers login, logout and the current user without a backend, so the
 * template runs on its own. Only active with VITE_FAKE_API=true.
 */
export const installFakeApi = (client: Client) => {
	client.interceptors.response.use(async (res) => {
		const { pathname } = new URL(res.url);

		if (pathname.endsWith("/api/auth/login")) {
			await cookieStore.set({ name: COOKIE, value: "yes" });
			return empty();
		}
		if (pathname.endsWith("/api/auth/logout")) {
			await cookieStore.delete(COOKIE);
			return empty();
		}
		if (pathname.endsWith("/api/users/current")) {
			return (await cookieStore.get(COOKIE))
				? json({ email: "user@example.com" })
				: json(
						{ status: 401, title: "Unauthenticated." },
						401,
					);
		}
		return res;
	});
};
