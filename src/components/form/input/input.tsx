import {
	Input as BaseInput,
	type InputProps as BaseInputProps,
} from "@base-ui/react/input";
import classNames from "classnames";
import style from "./input.module.scss";

export type InputProps = BaseInputProps;

const Input = ({
	type = "text",
	className,
	...props
}: InputProps) => (
	<BaseInput
		type={type}
		className={classNames(style.input, className)}
		{...props}
	/>
);

export default Input;
