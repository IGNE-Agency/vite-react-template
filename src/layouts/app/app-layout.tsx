import AppHeader from "layouts/app/app-header";
import { useAuth } from "lib/auth";
import {
	Navigate,
	Outlet,
	useLocation,
} from "react-router";
import style from "./app-layout.module.scss";

const LoggedInLayout = () => {
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
