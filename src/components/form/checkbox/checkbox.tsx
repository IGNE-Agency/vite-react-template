import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import CheckIcon from "./check.svg?react";
import style from "./checkbox.module.scss";

type CheckboxProps = React.ComponentProps<
	typeof BaseCheckbox.Root
> & {
	label: string;
};

const Checkbox = ({
	id,
	label,
	...props
}: CheckboxProps) => {
	return (
		<label htmlFor={id} className={style.label}>
			<BaseCheckbox.Root
				id={id}
				className={style.control}
				{...props}
			>
				<BaseCheckbox.Indicator className={style.indicator}>
					<CheckIcon />
				</BaseCheckbox.Indicator>
			</BaseCheckbox.Root>
			{label}
		</label>
	);
};

export default Checkbox;
