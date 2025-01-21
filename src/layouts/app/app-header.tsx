import Moon from "assets/icons/moon.svg?react";
import classNames from "classnames";
import { useAppState } from "lib/app-state";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import style from "./app-layout.module.scss";

const links = [
	{
		to: "/",
		icon: <Moon width="1rem" />,
		name: "home"
	}
];

const AppHeader = () => {
	const { t, i18n } = useTranslation();
	const [, dispatch] = useAppState();

	const languageOptions = i18n.languages.map(lang => ({
		value: lang,
		label: new Intl.DisplayNames([lang], {
			type: "language"
		}).of(lang)
	}));

	return (
		<header>
			<div
				className={classNames([
					style.header,
					style.row,
					style.full
				])}>
				<nav className={style.row}>
					{links.map(link => (
						<NavLink
							key={link.to}
							to={link.to}
							className={({ isActive }) =>
								classNames([
									style.link,
									isActive && style.active
								])
							}>
							{link.icon}
							<span>
								{t(`pages.${link.name}.title`)}
							</span>
						</NavLink>
					))}
				</nav>
				<div className={style.row}>
					<select
						defaultValue={i18n.resolvedLanguage}
						onChange={({ currentTarget: { value } }) =>
							i18n.changeLanguage(value)
						}>
						{languageOptions.map(
							({ value, label }) => (
								<option key={value} value={value}>
									{label}
								</option>
							)
						)}
					</select>
					<button
						onClick={() =>
							dispatch({ type: "logout" })
						}>
						{t("layouts.app.logout")}
					</button>
				</div>
			</div>
		</header>
	);
};

export default AppHeader;
