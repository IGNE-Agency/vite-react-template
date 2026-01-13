import { Input as InputPrimitive } from "@base-ui/react/input";
import style from "./input.module.scss";

type Props = InputPrimitive.Props & {
	isInvalid?: boolean;
};

function Input({
	isInvalid,
	type = "text",
	...props
}: Props) {
	return (
		<InputPrimitive
			type={type}
			aria-invalid={isInvalid}
			className={style.input}
			{...props}
		/>
	);
}

export default Input;
