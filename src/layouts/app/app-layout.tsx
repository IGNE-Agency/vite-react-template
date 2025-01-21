import AppHeader from "layouts/app/app-header";
import { useAppState } from "lib/app-state";
import {
	Navigate,
	Outlet,
	useLocation
} from "react-router";
import style from "./app-layout.module.scss";

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
			<AppHeader />
			<main>
				<div className={style.full}>
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default LoggedInLayout;
