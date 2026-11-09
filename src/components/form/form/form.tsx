import { Fieldset } from "@base-ui/react/fieldset";
import { clsx } from "clsx";
import style from "./form.module.scss";

type FormProps = React.ComponentProps<"form"> &
	Readonly<{
		disabled?: boolean;
	}>;

const Form = ({
	children,
	className,
	disabled = false,
	...props
}: FormProps) => {
	return (
		<form
			className={clsx([className])}
			noValidate
			{...props}>
			<Fieldset.Root
				disabled={disabled}
				className={style.disablerFieldset}>
				{children}
			</Fieldset.Root>
		</form>
	);
};

export default Form;
