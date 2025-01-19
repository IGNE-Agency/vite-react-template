import { useAppState } from "lib/app-state";
import {
	Navigate,
	Outlet,
	useLocation
} from "react-router";

const AppLayout = () => {
	const [{ user }] = useAppState();
	const { pathname } = useLocation();

	if (!user) {
		return (
			<Navigate
				to="/login"
				replace
				state={{ redirect: pathname }}
			/>
		);
	}

	return (
		<div>
			<header>Header</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default AppLayout;
