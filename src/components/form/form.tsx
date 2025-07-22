import classNames from "classnames";
import { forwardRef } from "react";
import style from "./form.module.scss";

type FormProps = React.ComponentPropsWithRef<"form"> & {
	disabled?: boolean;
};

const Form = forwardRef<HTMLFormElement, FormProps>(
	(
		{ children, className, disabled = false, ...props },
		ref,
	) => {
		return (
			<form
				ref={ref}
				className={classNames([className])}
				{...props}
			>
				<fieldset
					disabled={disabled}
					className={style.disablerFieldset}
				>
					{children}
				</fieldset>
			</form>
		);
	},
);

export default Form;
