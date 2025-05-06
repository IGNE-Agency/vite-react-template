import type React from "react";
import {
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

type PageTitleContext = Readonly<{
	title: string;
	useTitle: (title: string) => void;
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

	const useTitle: PageTitleContext["useTitle"] = (
		title,
	) => {
		const before = document.title;
		useEffect(() => {
			setTitle(title);
			document.title = `${title} | ${name}`;
			return () => {
				document.title = before;
			};
		}, [title, name, before]);
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
		throw new Error(
			"usePageTitle must be used within a PageTitleProvider",
		);
	}

	return context;
};

export const usePageTitle: PageTitleContext["useTitle"] = (
	title,
) => {
	const context = usePageTitleContext();
	context.useTitle(title);
	return context.title;
};
