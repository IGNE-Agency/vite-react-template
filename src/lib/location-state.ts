import { useLocation } from "react-router";
import type { Schema } from "zod";

const useLocationState = <T>(schema: Schema<T>) => {
	const location = useLocation();
	const state = schema.parse(location);
	return state;
};

export default useLocationState;
