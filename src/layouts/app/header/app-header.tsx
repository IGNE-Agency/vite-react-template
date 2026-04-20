import { Link, useNavigate } from "@tanstack/react-router";
import Logo from "assets/icons/logo.svg?react";
import classNames from "classnames";
import { Button, Select } from "components/form";
import { useAuth } from "lib/auth";
import { useLocale } from "lib/i18n";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";
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

	const languageOptions = (
		i18n.options.supportedLngs as Readonly<string[]>
	)
		.filter((lng) => lng !== "cimode")
		.toSorted((a, b) => a.localeCompare(b, locale))
		.map((lang) => ({
			value: lang,
			label:
				new Intl.DisplayNames([lang], {
					type: "language",
				}).of(lang) ?? "",
		}));

	const handleLogout = () => {
		flushSync(() => setToken(undefined));
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
							<span>{t(`pages.${link.name}.title`)}</span>
						</Link>
					))}
				</nav>
				<div className={style.row}>
					<Select
						name="lang"
						options={languageOptions}
						defaultValue={i18n.resolvedLanguage}
						onChange={({ currentTarget: { value } }) =>
							i18n.changeLanguage(value)
						}
					/>
					<Button onClick={handleLogout}>
						{t("layouts.app.logout")}
					</Button>
				</div>
			</div>
		</header>
	);
};

export default AppHeader;
