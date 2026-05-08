const APP_NAME = "Template";
const DELIMITER = "·";

/**
 * Appends the app name to a page title.
 *
 * @example
 * makePageTitle("Login") // "Login · Template"
 */
export const makePageTitle = (pageTitle: string): string =>
	`${pageTitle} ${DELIMITER} ${APP_NAME}`;
