import type { UseFormReturn } from "lib/form";
import style from "./issues.module.scss";

type IssuesProps<T> = Readonly<{
	name?: string;
	form: UseFormReturn<T>;
}>;

const Issues = <T,>({
	name = "*",
	form
}: IssuesProps<T>) => {
	const issues = form.issues
		?.filter(({ path }) => path.join(".") === name)
		.map(issue => (
			<li key={issue.code}>{issue.message}</li>
		));

	if (!issues?.length) return null;

	return <ul className={style.issues}>{issues}</ul>;
};

export default Issues;
