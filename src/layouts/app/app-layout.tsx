import { Outlet } from "react-router";
import style from "./app-layout.module.scss";
import AppHeader from "./header/app-header";

const LoggedInLayout = () => {
	return (
		<div className={style.layout}>
			<AppHeader />
			<main className={style.gridMain}>
				<Outlet />
			</main>
		</div>
	);
};

export default LoggedInLayout;
