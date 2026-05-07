import { useRouterState } from "@tanstack/react-router";
import { APP_TITLE, buildTitle } from "lib/title";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

type TitleState = Readonly<{
	notificationCount: number;
	hasUrgentEvent: boolean;
}>;

type TitleStateContextValue = TitleState &
	Readonly<{
		setTitleState: (patch: Partial<TitleState>) => void;
	}>;

const TitleStateContext =
	createContext<TitleStateContextValue | null>(null);

/** Provides reactive title prefix state. Render once at the root of the app. */
export const TitleStateProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [state, setState] = useState<TitleState>({
		notificationCount: 0,
		hasUrgentEvent: false,
	});

	const setTitleState = (patch: Partial<TitleState>) =>
		setState((prev) => ({ ...prev, ...patch }));

	return (
		<TitleStateContext value={{ ...state, setTitleState }}>
			{children}
		</TitleStateContext>
	);
};

/**
 * Reads and updates the reactive title prefix (notification count + urgency flag).
 *
 * Call `setTitleState` from any component to update the browser tab title prefix.
 * The change takes effect immediately across all routes.
 *
 * @example
 * // "Dashboard (3) · Template" — show unread count
 * const { setTitleState } = useTitleState()
 * setTitleState({ notificationCount: 3 })
 *
 * @example
 * // "(!) Dashboard · Template" — signal an urgent event
 * setTitleState({ hasUrgentEvent: true })
 *
 * @example
 * // "(!) Dashboard (3) · Template" — both at once
 * setTitleState({ notificationCount: 3, hasUrgentEvent: true })
 *
 * @example
 * // Clear all prefixes
 * setTitleState({ notificationCount: 0, hasUrgentEvent: false })
 */
export const useTitleState = (): TitleStateContextValue => {
	const ctx = useContext(TitleStateContext);
	if (!ctx) {
		throw new Error(
			"useTitleState must be used within TitleStateProvider",
		);
	}
	return ctx;
};

const FAVICON_SIZE = 128;
const BADGE_RADIUS = 24;

let cachedFaviconSvg: string | null = null;

const loadFaviconSvg = (): Promise<string> => {
	if (cachedFaviconSvg !== null) {
		return Promise.resolve(cachedFaviconSvg);
	}
	return fetch("/favicon.svg")
		.then((r) => r.text())
		.then((svg) => {
			cachedFaviconSvg = svg;
			return svg;
		});
};

/**
 * Overlays a red badge on the favicon when `hasUrgentEvent` or a notification count is present.
 * Restores the original favicon when both flags clear.
 * Render once in the root component.
 */
export const FaviconManager = () => {
	const { notificationCount, hasUrgentEvent } =
		useTitleState();
	const hasNotifications = !!notificationCount;

	useEffect(() => {
		let cancelled = false;

		loadFaviconSvg().then((svg) => {
			if (cancelled) return;
			const blob = new Blob([svg], {
				type: "image/svg+xml",
			});
			const url = URL.createObjectURL(blob);
			const img = new Image();

			img.onload = () => {
				URL.revokeObjectURL(url);
				if (cancelled) return;

				const canvas = document.createElement("canvas");
				canvas.width = FAVICON_SIZE;
				canvas.height = FAVICON_SIZE;
				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				ctx.drawImage(
					img,
					0,
					0,
					FAVICON_SIZE,
					FAVICON_SIZE,
				);

				if (hasUrgentEvent || hasNotifications) {
					const x = FAVICON_SIZE - BADGE_RADIUS;
					const y = BADGE_RADIUS;
					ctx.beginPath();
					ctx.arc(x, y, BADGE_RADIUS, 0, 2 * Math.PI);
					ctx.fillStyle = getComputedStyle(
						document.documentElement,
					)
						.getPropertyValue("--color-error-500")
						.trim();
					ctx.fill();
				}

				const link =
					document.querySelector<HTMLLinkElement>(
						'link[rel="icon"]',
					);
				if (link) link.href = canvas.toDataURL("image/png");
			};

			img.src = url;
		});

		return () => {
			cancelled = true;
		};
	}, [hasUrgentEvent, hasNotifications]);

	return null;
};

export const TitleManager = () => {
	const { notificationCount, hasUrgentEvent } =
		useTitleState();
	const matches = useRouterState({
		select: (s) => s.matches,
	});

	const pageTitle = matches
		.flatMap((match) => match.meta ?? [])
		.findLast((tag) => tag?.title)?.title;

	return (
		<title>
			{pageTitle
				? buildTitle(pageTitle, {
						notificationCount,
						hasUrgentEvent,
					})
				: APP_TITLE}
		</title>
	);
};
