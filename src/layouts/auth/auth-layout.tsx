import Logo from "assets/icons/moon.svg?react";
import { Outlet } from "react-router";
import style from "./auth-layout.module.scss";

const AuthLayout = () => (
	<div className={style.layout}>
		<div className={style.logo}>
			<Logo width="5rem" />
		</div>
		<Outlet />
	</div>
);

export default AuthLayout;
