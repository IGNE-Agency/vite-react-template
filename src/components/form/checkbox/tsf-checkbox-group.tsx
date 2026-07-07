import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { useFieldContext } from "lib/forms";
import Field from "../field/field";
import Checkbox from "./checkbox";
import style from "./checkbox.module.scss";

export type CheckboxGroupItem = Readonly<{
	label: string;
	value: string;
}>;

type Props = {
	fieldLabel: string;
	items: CheckboxGroupItem[];
	required?: boolean;
	description?: string;
};

/**
 * Simple CheckboxGroup intended for checking items in an optional list
 * All checkboxes have the same name. The value will be an array of checked checkbox strings
 */
const TSFCheckboxGroup = ({
	fieldLabel,
	description,
	required,
	items,
}: Props) => {
	const field = useFieldContext<string[]>();

	return (
		<Field.Root>
			<Field.Label required={required}>
				{fieldLabel}
			</Field.Label>

			<BaseCheckboxGroup
				aria-labelledby={`${field.name}-label`}
				className={style.checkboxGroup}
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
			<Field.Error>{field.getMeta().errors}</Field.Error>
			<Field.Description>{description}</Field.Description>
		</Field.Root>
	);
};

export default TSFCheckboxGroup;
