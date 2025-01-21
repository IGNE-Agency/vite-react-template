import { Outlet } from "react-router";
import style from "./global-layout.module.scss";

const GlobalLayout = () => (
	<div className={style.layout}>
		<Outlet />
	</div>
);

export default GlobalLayout;
