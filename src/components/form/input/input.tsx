import style from "./input.module.scss";

type Props = React.ComponentPropsWithoutRef<"input"> & {
	name: string;
	label?: string;
	isInvalid?: boolean;
};

function Input({
	label,
	isInvalid,
	type = "text",
	...props
}: Props) {
	return (
		<>
			{label && <span>{label}</span>}
			<input
				type={type}
				aria-invalid={isInvalid}
				className={style.input}
				{...props}
			/>
		</>
	);
}

export default Input;
