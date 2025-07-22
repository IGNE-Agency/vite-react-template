import Spinner from "assets/icons/spinner.svg?react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./loading-indicator.module.scss";

const LoadingIndicator = () => {
	const { t } = useTranslation();

	// TODO: update the messages for your client! (probably one message is enough)
	const messages = t(
		"components.loadingIndicator.messages",
		{
			returnObjects: true,
		},
	) as ReadonlyArray<string>;
	const [message, setMessage] = useState(
		messages[Math.floor(Math.random() * messages.length)],
	);

	useEffect(() => {
		const updateLoadingMessage = () => {
			let newMessage = message;
			while (newMessage === message) {
				newMessage =
					messages[
						Math.floor(Math.random() * messages.length)
					];
			}
			setMessage(newMessage);
		};

		const interval = setInterval(
			updateLoadingMessage,
			5000,
		);

		return () => {
			clearInterval(interval);
		};
	});

	return (
		<div className={style.loadingIndicator}>
			<Spinner width="3em" />
			<p>{message}</p>
		</div>
	);
};

export default LoadingIndicator;
