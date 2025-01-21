import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type PageTitleContext = Readonly<{
	title: string;
	// biome-ignore lint/suspicious/noExplicitAny: Dependencies can really be anything.
	useTitle: (title: string, deps?: any) => void;
}>;

const PageTitleContext = createContext<PageTitleContext>({
	title: "",
	useTitle: () => {},
});

export const PageTitleProvider: React.FC<{
	children: React.ReactNode;
	name: string;
}> = ({ children, name }) => {
	const [title, setTitle] = useState("");

	const useTitle: PageTitleContext["useTitle"] = (title, deps) => {
		const before = document.title;
		// biome-ignore lint/correctness/useExhaustiveDependencies: Biome cannot figure out dynamic deps
		useEffect(() => {
			setTitle(title);
			document.title = `${title} | ${name}`;
			return () => {
				document.title = before;
			};
		}, [deps, title, name, before].flat(Number.POSITIVE_INFINITY));
	};

	return (
		<PageTitleContext.Provider value={{ title, useTitle }}>
			{children}
		</PageTitleContext.Provider>
	);
};

export const usePageTitleContext = () => {
	const context = useContext(PageTitleContext);

	if (!context) {
		throw new Error("usePageTitle must be used within a PageTitleProvider");
	}

	return context;
};

export const usePageTitle: PageTitleContext["useTitle"] = (title, deps) => {
	const context = usePageTitleContext();
	context.useTitle(title, deps);
	return context.title;
};
