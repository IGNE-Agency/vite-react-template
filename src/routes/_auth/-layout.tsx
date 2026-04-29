import { Outlet } from "@tanstack/react-router";
import Logo from "assets/icons/logo.svg?react";
import style from "./-layout.module.scss";

const AuthLayout = () => (
	<div className={style.layout}>
		<div className={style.logo}>
			<Logo width="5rem" />
		</div>
		<div className={style.page}>
			<Outlet />
		</div>
	</div>
);

export default AuthLayout;
