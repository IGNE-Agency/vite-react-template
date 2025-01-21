import Moon from "assets/icons/moon.svg?react";
import classNames from "classnames";
import style from "layouts/app-layout.module.scss";
import { useAppState } from "lib/app-state";
import {
	Navigate,
	NavLink,
	Outlet,
	useLocation
} from "react-router";

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

	const links = [
		{
			to: "/",
			icon: <Moon width="1rem" />,
			label: "Home"
		},
		{ to: "/test", label: "Test" }
	];

	return (
		<div className={style.layout}>
			<header>
				<nav>
					{links.map(link => (
						<NavLink
							to={link.to}
							className={({ isActive }) =>
								classNames([
									style.link,
									isActive && style.active
								])
							}>
							{link.icon}
							<span>{link.label}</span>
						</NavLink>
					))}
				</nav>
			</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default LoggedInLayout;
