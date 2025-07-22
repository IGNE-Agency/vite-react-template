import type { UseFormReturn } from "lib/form";
import style from "./issues.module.scss";

type IssuesProps<T> = Readonly<{
	name?: string;
	form: UseFormReturn<T>;
}>;

/** A coponent for showing any issues related to a form with
 * a given field `name`.
 *
 * If `name` is omitted, it will instead show all issues
 * whose `path` is empty.
 *
 * If no issues are found with a given `name`, this component
 * will not render anything.
 */
const Issues = <T,>({ name, form }: IssuesProps<T>) => {
	const issues = form.issues
		?.filter(
			({ path }) =>
				(!name && path.length === 0) ||
				path.join(".") === name,
		)
		.map((issue) => (
			<li key={issue.message}>{issue.message}</li>
		));

	if (!issues?.length) {
		return null;
	}

	return <ul className={style.issues}>{issues}</ul>;
};

export default Issues;
