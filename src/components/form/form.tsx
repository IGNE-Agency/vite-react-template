import classNames from "classnames";
import type { UseFormReturn } from "lib/form";
import type { HTMLAttributes } from "react";
import style from "./form.module.scss";

type FormProps<T> = HTMLAttributes<HTMLFormElement> &
	Readonly<{
		form: UseFormReturn<T>;
	}>;

const Form = <T,>({ form, children, className, ...props }: FormProps<T>) => (
	<form className={classNames([className])} {...props}>
		<fieldset disabled={form.isSubmitting} className={style.contents}>
			{children}
		</fieldset>
	</form>
);

export default Form;
