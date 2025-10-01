import type { HTMLAttributes } from "react";
import style from "./error-text.module.scss";

type Props = HTMLAttributes<"p"> & {
	el?: "p" | "span";
};

export function ErrorText({ el = "p", children }: Props) {
	const El = el;
	return <El className={style.text}>{children}</El>;
}
