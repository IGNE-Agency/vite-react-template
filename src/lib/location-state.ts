import { useLocation } from "react-router";
import type { Schema } from "zod";

/**
 * If you expect state to be set at a certain location, use this function to extract it.
 *
 * Example:
 * If you navigated to this location and set `redirect` in the state,
 * create a zod schema that expects the redirect property and run this function.
 * `const state = useLocationState(z.object({ redirect: z.string().optional() }))`
 *
 * Now typescript will know that the state can have the `redirect` property.
 *
 * @param schema
 * @returns
 */
const useLocationState = <T>(schema: Schema<T>) => {
	const location = useLocation();
	const state = schema.parse(location);
	return state;
};

export default useLocationState;
