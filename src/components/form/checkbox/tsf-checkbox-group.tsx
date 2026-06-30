import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { useFieldContext } from "lib/forms";
import { normalizeFieldErrors } from "lib/forms/validation-helpers";
import Field, { type FieldProps } from "../field/field";
import Checkbox from "./checkbox";

export type CheckboxGroupItem = Readonly<{
	label: string;
	value: string;
}>;

// Using TSF `name` as id
type CheckboxProps = Omit<
	FieldProps,
	"id" | "error" | "children"
> & {
	label: string;
	items: CheckboxGroupItem[];
};

/**
 * Simple CheckboxGroup intended for checking items in an optional list
 * All checkboxes have the same name. The value will be an array of checked checkbox strings
 */
const TSFCheckboxGroup = ({
	label: fieldLabel,
	description,
	required,
	noError,
	className,
	items,
}: CheckboxProps) => {
	const field = useFieldContext<string[]>();
	return (
		<Field
			id={field.name}
			label={fieldLabel}
			description={description}
			required={required}
			error={normalizeFieldErrors(field.getMeta().errors)}
			noError={noError}
			className={className}
		>
			<BaseCheckboxGroup
				aria-labelledby={`${field.name}-label`}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
			>
				{items.map(({ label, value }) => (
					<Checkbox
						key={value}
						id={`${field.name}-${value}`}
						value={value}
						label={label}
						onBlur={field.handleBlur}
						aria-invalid={!field.state.meta.isValid}
					/>
				))}
			</BaseCheckboxGroup>
		</Field>
	);
};

export default TSFCheckboxGroup;
