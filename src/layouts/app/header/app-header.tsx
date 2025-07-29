import Logo from "assets/icons/logo.svg?react";
import classNames from "classnames";
import { useAuth } from "lib/auth";
import { useLocale } from "lib/i18n";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router";
import theme from "style/theme.module.scss";
import style from "./app-header.module.scss";

const links = [
	{
		to: "/",
		icon: <Logo width="1rem" />,
		name: "home",
	},
];

const AppHeader = () => {
	const { t, i18n } = useTranslation();
	const [, setToken] = useAuth();
	const locale = useLocale();
	const navigate = useNavigate();

	const languageOptions = i18n.languages
		.toSorted((a, b) => a.localeCompare(b, locale))
		.map((lang) => ({
			value: lang,
			label: new Intl.DisplayNames([lang], {
				type: "language",
			}).of(lang),
		}));

	const handleLogout = () => {
		setToken(undefined);
		navigate("/");
	};

	return (
		<header>
			<div
				className={classNames([style.header, style.row])}
			>
				<nav className={style.row}>
					{links.map((link) => (
						<NavLink
							key={link.to}
							to={link.to}
							className={({ isActive }) =>
								classNames([
									style.link,
									isActive && style.active,
								])
							}
						>
							{link.icon}
							<span>{t(`pages.${link.name}.title`)}</span>
						</NavLink>
					))}
				</nav>
				<div className={style.row}>
					<select
						defaultValue={i18n.resolvedLanguage}
						onChange={({ currentTarget: { value } }) =>
							i18n.changeLanguage(value)
						}
						className={theme.input}
					>
						{languageOptions.map(({ value, label }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
					<button
						type="button"
						onClick={handleLogout}
						className={theme.button}
					>
						{t("layouts.app.logout")}
					</button>
				</div>
			</div>
		</header>
	);
};

export default AppHeader;
