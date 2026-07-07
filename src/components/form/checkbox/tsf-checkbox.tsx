import { useFieldContext } from "lib/forms";
import Field from "../field/field";
import Checkbox, { type CheckboxProps } from "./checkbox";
import style from "./checkbox.module.scss";

type Props = CheckboxProps & {
	label: string;
	fieldLabel?: string;
	description?: string;
};

const TSFCheckbox = ({
	label,
	fieldLabel,
	description,
	required,
	className,
	...props
}: Props) => {
	const field = useFieldContext<boolean>();

	return (
		<Field.Root className={style.root}>
			<Field.Label required={required}>
				{fieldLabel}
			</Field.Label>
			<Checkbox
				id={field.name}
				label={label}
				checked={field.state.value}
				onCheckedChange={(checked) =>
					field.handleChange(checked)
				}
				onBlur={field.handleBlur}
				aria-invalid={!field.state.meta.isValid}
				{...props}
			/>
			<Field.Error>{field.getMeta().errors}</Field.Error>
			<Field.Description>{description}</Field.Description>
		</Field.Root>
	);
};

export default TSFCheckbox;
