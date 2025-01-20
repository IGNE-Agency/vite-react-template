import style from "layouts/auth-layout.module.scss";
import { Outlet } from "react-router";

const AuthLayout = () => (
	<div className={style.layout}>
		<Outlet />
	</div>
);

export default AuthLayout;
