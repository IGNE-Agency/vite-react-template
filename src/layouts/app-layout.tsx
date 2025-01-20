import style from "layouts/app-layout.module.scss";
import { useAppState } from "lib/app-state";
import {
	Navigate,
	Outlet,
	useLocation
} from "react-router";

const LoggedInLayout = () => {
	const [{ user }] = useAppState();
	const { pathname } = useLocation();

	if (!user) {
		return (
			<Navigate
				to="login"
				replace
				state={{ redirect: pathname }}
			/>
		);
	}

	return (
		<div className={style.layout}>
			<header>Header</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default LoggedInLayout;
