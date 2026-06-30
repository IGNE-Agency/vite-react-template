import { Field as BaseField } from "@base-ui/react/field";
import classNames from "classnames";
import { ErrorText } from "components/error-text/error-text";
import * as m from "lib/paraglide/messages";
import style from "./field.module.scss";

export type FieldProps = {
	id: string;
	label?: string;
	description?: string;
	required?: boolean;
	error?: string | string[];
	noError?: true; // Handy for multiple small fields in a row
	className?: string;
	children: React.ReactElement; // Input, Checkbox, etc
};

const Field = ({
	id,
	label,
	description,
	required = false,
	error,
	noError,
	className,
	children,
}: FieldProps) => {
	return (
		<BaseField.Root
			className={classNames(style.field, className)}
		>
			{label && (
				<BaseField.Label
					className={style.label}
					htmlFor={id}
				>
					{label} {required && m.forms_optional()}
				</BaseField.Label>
			)}
			{children}
			{!noError && (
				<ErrorText el="label" htmlFor={id}>
					{error}
				</ErrorText>
			)}
			{description && (
				<BaseField.Description
					className={style.description}
				>
					{description}
				</BaseField.Description>
			)}
		</BaseField.Root>
	);
};

export default Field;
