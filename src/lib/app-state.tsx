import { useLocalStorage } from "@uidotdev/usehooks";
import { Auth, User } from "lib/api";
import {
	Dispatch,
	ReactNode,
	createContext,
	useContext,
	useReducer
} from "react";

type Settings = Readonly<{
	locale?: string;
}>;

type AppState = Readonly<{
	user?: User;
	auth?: Auth;
	settings: Settings;
}>;

type Action =
	| LoginAction
	| ClearAction
	| SettingsAction;

type LoginAction = Readonly<{
	type: "login";
	user: User;
}>;

type ClearAction = Readonly<{
	type: "clear";
}>;

type SettingsAction = Readonly<{
	type: "settings";
	settings: Partial<Settings>;
}>;

const defaultState: AppState = {
	settings: {}
};

const defaultAction: Dispatch<Action> = () => {};

const AppContext = createContext([
	defaultState,
	defaultAction
] as const);

const reducer = (
	state: AppState,
	action: Action
): AppState => {
	switch (action.type) {
		case "clear": {
			return { settings: {} };
		}
		case "login": {
			return { ...state, user: action.user };
		}
		case "settings": {
			return {
				...state,
				settings: {
					...state.settings,
					...action.settings
				}
			};
		}
		default: {
			throw new Error(
				`Unhandled action type "${
					(action as any).type
				}"`
			);
		}
	}
};

type AppStateProviderProps = Readonly<{
	children?: ReactNode;
}>;

export const AppStateProvider = ({
	children
}: AppStateProviderProps) => {
	const [saved] = useLocalStorage(
		"state",
		defaultState
	);
	const [state, dispatch] = useReducer(reducer, saved);

	return (
		<AppContext.Provider value={[state, dispatch]}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppState = () => {
	const context = useContext(AppContext);

	if (!context) {
		throw new Error(
			"useAppState must be called in a descendant of an AppStateProvider."
		);
	}

	return context;
};
