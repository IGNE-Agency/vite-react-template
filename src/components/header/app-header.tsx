import { Link, useNavigate } from "@tanstack/react-router";
import Logo from "assets/icons/logo.svg?react";
import classNames from "classnames";
import { Button, Select } from "components/form";
import { postApiAuthLogout } from "lib/heyapi";
import { useLocale } from "lib/i18n";
import * as m from "lib/paraglide/messages";
import type { Locale } from "lib/paraglide/runtime";
import { locales, setLocale } from "lib/paraglide/runtime";
import { useTitleState } from "lib/title-state";
import style from "./app-header.module.scss";

const links = [
	{
		// TODO: How do we get this from the router config so we know it's safe?
		to: "/" as const,
		icon: <Logo width="1rem" />,
		label: m.home_title,
	},
];

const AppHeader = () => {
	const locale = useLocale();
	const navigate = useNavigate();
	const {
		notificationCount,
		hasUrgentEvent,
		setTitleState,
	} = useTitleState();

	const languageOptions = locales
		.toSorted((a, b) => a.localeCompare(b, locale))
		.map((lang) => ({
			value: lang,
			label:
				new Intl.DisplayNames([lang], {
					type: "language",
				}).of(lang) ?? "",
		}));

	const handleLogout = async () => {
		await postApiAuthLogout();
		navigate({ to: "/login" });
	};

	return (
		<header>
			<div
				className={classNames([style.header, style.row])}
			>
				<nav className={style.row}>
					{links.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className={style.link}
						>
							{link.icon}
							<span>{link.label()}</span>
						</Link>
					))}
				</nav>
				<div className={style.row}>
					<Button
						onClick={() =>
							setTitleState({
								notificationCount: notificationCount + 1,
							})
						}
					>
						{m.nav_add_notification()}
					</Button>
					<Button
						onClick={() =>
							setTitleState({
								hasUrgentEvent: !hasUrgentEvent,
							})
						}
					>
						{m.nav_toggle_urgent()}
					</Button>
					<Select
						name="lang"
						options={languageOptions}
						defaultValue={locale.toString()}
						onChange={({ currentTarget: { value } }) =>
							setLocale(value as Locale)
						}
					/>
					<Button onClick={handleLogout}>
						{m.nav_logout()}
					</Button>
				</div>
			</div>
		</header>
	);
};

export default AppHeader;
