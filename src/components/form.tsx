import { UseFormReturn } from "lib/form";
import { HTMLAttributes } from "react";
import style from "./form.module.css";

type FormProps<T> = HTMLAttributes<HTMLFormElement> &
	Readonly<{
		form: UseFormReturn<T>;
	}>;

const Form = <T,>({
	form,
	children,
	...props
}: FormProps<T>) => (
	<form {...props}>
		<fieldset
			disabled={form.isSubmitting}
			className={style.fields}>
			{children}
		</fieldset>
	</form>
);

export default Form;
