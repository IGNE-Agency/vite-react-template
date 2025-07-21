import AppHeader from "layouts/app/app-header";
import { Outlet } from "react-router";
import style from "./app-layout.module.scss";
import AppHeader from "./header/app-header";

const LoggedInLayout = () => {
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
