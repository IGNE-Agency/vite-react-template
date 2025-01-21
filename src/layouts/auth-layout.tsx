import Logo from "assets/icons/moon.svg?react";
import style from "layouts/auth-layout.module.scss";
import { Outlet } from "react-router";

const AuthLayout = () => (
	<div className={style.layout}>
		<div className={style.logo}>
			<Logo width="5rem" />
		</div>
		<Outlet />
	</div>
);

export default AuthLayout;
