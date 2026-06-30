import { useFieldContext } from "lib/forms";
import { normalizeFieldErrors } from "lib/forms/validation-helpers";
import Field, { type FieldProps } from "../field/field";
import Checkbox from "./checkbox";

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
		</Field>
	);
};

export default TSFCheckbox;
