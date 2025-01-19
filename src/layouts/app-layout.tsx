import { Outlet } from "react-router";

const AppLayout = () => (
	<div>
		<header>Header</header>
		<main>
			<Outlet />
		</main>
	</div>
);

export default AppLayout;
