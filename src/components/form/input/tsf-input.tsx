import {
	Input as BaseInput,
	type InputProps as BaseInputProps,
} from "@base-ui/react/input";
import { useFieldContext } from "lib/forms";
import { normalizeFieldErrors } from "lib/forms/validation-helpers";
import Field, { type FieldProps } from "../field/field";
import style from "./input.module.scss";

// Using TSF `name` as id
type InputProps = Omit<
	BaseInputProps,
	"id" | "defaultValue"
> &
	Omit<FieldProps, "id" | "error" | "children">;

const TSFInput = ({
	type = "text",
	label,
	description,
	required,
	noError,
	className,
	...props
}: InputProps) => {
	const field = useFieldContext<string>();
	return (
		<Field
			id={field.name}
			label={label}
			description={description}
			required={required}
			error={normalizeFieldErrors(field.getMeta().errors)}
			noError={noError}
			className={className}
		>
			<BaseInput
				type={type}
				id={field.name}
				className={style.input}
				value={field.state.value}
				onChange={(evt) =>
					field.handleChange(evt.target.value)
				}
				onBlur={field.handleBlur}
				aria-invalid={!field.state.meta.isValid}
				{...props}
			/>
		</Field>
	);
};

export default TSFInput;
