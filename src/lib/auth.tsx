import { useLocalStorage } from "@uidotdev/usehooks";
import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

type AuthContext = readonly [
	string | null | undefined,
	Dispatch<SetStateAction<string | null | undefined>>,
];

const AuthContext = createContext<AuthContext>([
	null,
	() => {},
]);

type AuthProviderProps = Readonly<{
	children?: ReactNode;
}>;

/** The name under which the API token will be saved
 * in localStorage. */
export const TOKEN_NAME = "token";

/** A simple provider to allow any component to check if we're
 * logged in or not. This is signalled by the presence
 * (or absence, respectively) of a token.
 */
export const AuthProvider = ({
	children,
}: AuthProviderProps) => {
	const state = useLocalStorage<string | null | undefined>(
		TOKEN_NAME,
	);

	return (
		<AuthContext.Provider value={state}>
			{children}
		</AuthContext.Provider>
	);
};

/** A hook for checking if we're logged in or not.
 * This is signalled by the presence (or absence,
 * respectively) of a token. */
export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error(
			"useAuth must be called in a descendant of an AuthProvider.",
		);
	}

	return context;
};
