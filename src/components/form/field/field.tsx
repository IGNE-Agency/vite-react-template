import { Field as FieldPrimitive } from "@base-ui/react/field";
import classNames from "classnames";
import style from "./field.module.scss";

const Field = ({
	children,
	className,
	...props
}: FieldPrimitive.Root.Props) => {
	return (
		<FieldPrimitive.Root
			{...props}
			className={classNames(style.field, className)}
		>
			{children}
		</FieldPrimitive.Root>
	);
};

const FieldLabel = ({
	children,
	className,
	...props
}: FieldPrimitive.Label.Props) => {
	return (
		<FieldPrimitive.Label
			{...props}
			className={classNames(style.label, className)}
		>
			{children}
		</FieldPrimitive.Label>
	);
};

const FieldDescription = ({
	children,
	className,
	...props
}: FieldPrimitive.Description.Props) => {
	return (
		<FieldPrimitive.Description
			{...props}
			className={classNames(style.description, className)}
		>
			{children}
		</FieldPrimitive.Description>
	);
};

const FieldError = ({
	children,
	className,
	...props
}: FieldPrimitive.Error.Props) => {
	return (
		<FieldPrimitive.Error {...props} className={className}>
			{children}
		</FieldPrimitive.Error>
	);
};

export { Field, FieldDescription, FieldError, FieldLabel };
