import style from "./button.module.scss";

type Props = React.ComponentPropsWithoutRef<"button">;
const Button = ({
	children,
	type = "button",
	...props
}: Props) => {
	return (
		<button type={type} className={style.button} {...props}>
			{children}
		</button>
	);
};

export default Button;
