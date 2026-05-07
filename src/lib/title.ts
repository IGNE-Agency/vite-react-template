/**
 * Global title configuration.
 *
 * To rename the app: change `APP_TITLE`.
 * To change the separator: change `TITLE_DELIMITER`.
 *
 * Common delimiters: "·", "|", "-", "—"
 *
 * @example
 * // With APP_TITLE = "Template" and TITLE_DELIMITER = "|":
 * buildTitle("Login") // "Login | Template"
 */
export const APP_TITLE = "Template";
export const TITLE_DELIMITER = "·";

/**
 * Builds a full browser tab title, including notification count and urgency prefix.
 *
 * @example
 * buildTitle("Login", { notificationCount: 0, hasUrgentEvent: false })   // "Login · Template"
 * buildTitle("Dashboard", { notificationCount: 3, hasUrgentEvent: false }) // "Dashboard (3) · Template"
 * buildTitle("Dashboard", { notificationCount: 0, hasUrgentEvent: true })  // "(!) Dashboard · Template"
 * buildTitle("Dashboard", { notificationCount: 3, hasUrgentEvent: true })  // "(!) Dashboard (3) · Template"
 */
export const buildTitle = (
	pageTitle: string,
	context: {
		notificationCount: number;
		hasUrgentEvent: boolean;
	},
): string => {
	const countSuffix =
		context.notificationCount > 0
			? ` (${context.notificationCount})`
			: "";
	const base = `${pageTitle}${countSuffix} ${TITLE_DELIMITER} ${APP_TITLE}`;
	return context.hasUrgentEvent ? `(!) ${base}` : base;
};
