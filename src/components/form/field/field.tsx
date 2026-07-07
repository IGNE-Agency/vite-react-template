import {
	Field as BaseField,
	type FieldRootProps as BaseFieldRootProps,
} from "@base-ui/react/field";
import classNames from "classnames";
import { ErrorText } from "components/error-text/error-text";
import { normalizeFieldErrors } from "lib/forms/validation-helpers";
import * as m from "lib/paraglide/messages";
import style from "./field.module.scss";

/**
 * Styling for fields, to wrap your form control with
 */
const FieldRoot = ({
	className,
	...props
}: FieldRootProps) => (
	<BaseField.Root
		className={classNames(style.field, className)}
		{...props}
	></BaseField.Root>
);
export type FieldRootProps = BaseFieldRootProps & {
	className?: string;
};

/**
 * Styled Field.Label. Won't render without children
 */
const FieldLabel = ({
	children,
	required,
	...props
}: FieldLabelProps) =>
	children && (
		<BaseField.Label className={style.label} {...props}>
			{children} {required && m.forms_optional()}
		</BaseField.Label>
	);
export type FieldLabelProps = BaseField.Label.Props & {
	required?: boolean;
};

/**
 * Styled Field.Description
 */
const FieldDescription = ({
	children,
	className,
	...props
}: BaseField.Description.Props) =>
	children && (
		<BaseField.Description
			className={classNames(style.description, className)}
			{...props}
		>
			{children}
		</BaseField.Description>
	);

/**
 * Custom Field.Error
 * Normalizes given errors to array of strings
 */
const FieldError = ({
	children: errors,
}: BaseField.Error.Props) => (
	<BaseField.Error
		match
		render={({ children, ...props }) => (
			<ErrorText el="span" {...props}>
				{normalizeFieldErrors(errors)}
			</ErrorText>
		)}
	/>
);
// export type FieldErrorProps = BaseField.Error.Props & {
// 	id: string;
// };

export default {
	...BaseField,
	Root: FieldRoot,
	Label: FieldLabel,
	Description: FieldDescription,
	Error: FieldError,
};
