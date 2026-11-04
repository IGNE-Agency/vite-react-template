import { Fieldset } from "@base-ui/react/fieldset";
import clsx from "clsx";
import style from "./form.module.scss";

type FormProps = React.ComponentProps<"form"> & {
	disabled?: boolean;
	legend?: string;
};

const Form = ({
	children,
	className,
	disabled = false,
	legend,
	...props
}: FormProps) => {
	return (
		<form
			className={clsx([className])}
			noValidate
			{...props}
		>
			<Fieldset.Root
				disabled={disabled}
				className={style.disablerFieldset}
			>
				{legend && (
					<Fieldset.Legend className={style.legend}>
						{legend}
					</Fieldset.Legend>
				)}
				{children}
			</Fieldset.Root>
		</form>
	);
};

export default Form;
