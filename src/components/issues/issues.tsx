import type { UseFormReturn } from "lib/form";
import { useTranslation } from "react-i18next";
import style from "./issues.module.scss";

type IssuesProps<T> = Readonly<{
	name?: string;
	form: UseFormReturn<T>;
}>;

const Issues = <T,>({
	name = "*",
	form
}: IssuesProps<T>) => {
	const { t } = useTranslation();
	const issues = form.issues
		?.filter(({ path }) => path.join(".") === name)
		.map(issue => (
			<li key={issue.code}>
				{issue.code === "custom"
					? issue.message
					: t(`forms.issues.${issue.code}`, { issue })}
			</li>
		));

	if (!issues?.length) return null;

	return <ul className={style.issues}>{issues}</ul>;
};

export default Issues;
