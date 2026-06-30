import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { useFieldContext } from "lib/forms";
import { normalizeFieldErrors } from "lib/forms/validation-helpers";
import Field, { type FieldProps } from "../field/field";
import CheckIcon from "./check.svg?react";
import style from "./checkbox.module.scss";

// Using TSF `name` as id
type CheckboxProps = Omit<
	FieldProps,
	"id" | "error" | "children"
> & {
	label: string;
};

const TSFCheckbox = ({
	label,
	description,
	required,
	noError,
	className,
	...props
}: CheckboxProps) => {
	const field = useFieldContext<boolean>();
	return (
		<Field
			id={field.name}
			description={description}
			required={required}
			error={normalizeFieldErrors(field.getMeta().errors)}
			noError={noError}
			className={className}
		>
			<label htmlFor={field.name} className={style.label}>
				<BaseCheckbox.Root
					id={field.name}
					className={style.control}
					checked={field.state.value}
					onCheckedChange={(checked) =>
						field.handleChange(checked)
					}
					onBlur={field.handleBlur}
					aria-invalid={!field.state.meta.isValid}
					{...props}
				>
					<BaseCheckbox.Indicator
						className={style.indicator}
					>
						<CheckIcon />
					</BaseCheckbox.Indicator>
				</BaseCheckbox.Root>
				{label}
			</label>
		</Field>
	);
};

export default TSFCheckbox;
