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
 * Builds a full browser tab title by appending the app name.
 *
 * @example
 * buildTitle("Login")            // "Login · Template"
 * buildTitle("Forgot password")  // "Forgot password · Template"
 */
export const buildTitle = (pageTitle: string): string =>
	[pageTitle, TITLE_DELIMITER, APP_TITLE].join(" ");
