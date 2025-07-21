import { useAuth } from "lib/auth";
import {
	Navigate,
	Outlet,
	useLocation,
} from "react-router";

// Could be extended by allowing only certain user roles, etc.
type ProtectedRouteProps = {
	children?: React.ReactNode;
};

/**
 * Can be used as route or component wrapper:
 *
 * <Route path="" element={<ProtectedRoute />}><SomePage /></Route>
 * or
 * <Route path="" element={<ProtectedRoute><SomePage /></ProtectedRoute>} />
 */
export const ProtectedRoute = ({
	children,
}: ProtectedRouteProps) => {
	const [token] = useAuth();
	const { pathname } = useLocation();

	if (!token) {
		return (
			<Navigate
				to="login"
				replace
				state={{ redirect: pathname }}
			/>
		);
	}

	return children ? children : <Outlet />;
};
