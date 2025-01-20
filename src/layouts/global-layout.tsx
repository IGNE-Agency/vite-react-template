import style from "layouts/global-layout.module.scss";
import { Outlet } from "react-router";

const GlobalLayout = () => (
	<div className={style.layout}>
		<Outlet />
	</div>
);

export default GlobalLayout;
