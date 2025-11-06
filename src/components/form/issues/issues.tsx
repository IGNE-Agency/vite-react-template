import type { ZodIssue } from "zod";
import style from "./issues.module.scss";

const Issues = ({ issues }: { issues?: ZodIssue[] }) => {
	if (!issues) return null;
	const items = issues.map(({ message }) => (
		<li key={message}>{message}</li>
	));

	return <ul className={style.issues}>{items}</ul>;
};

export default Issues;
