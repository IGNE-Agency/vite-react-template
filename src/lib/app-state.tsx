import { useLocalStorage } from "@uidotdev/usehooks";
import type { Authentication, UserDTO } from "lib/api";
import {
	type Dispatch,
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useReducer
} from "react";

type Settings = Readonly<{
	locale?: string;
}>;

type AppState = Readonly<{
	user?: UserDTO;
	auth?: Authentication;
	settings: Settings;
}>;

type Action =
	| LoginAction
	| ClearAction
	| SettingsAction;

type LoginAction = Readonly<{
	type: "login";
	user: UserDTO;
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
					(action as Action).type
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
	const [saved, setSaved] = useLocalStorage(
		"state",
		defaultState
	);
	const [state, dispatch] = useReducer(reducer, saved);

	useEffect(() => {
		setSaved(state);
	}, [state]);

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
