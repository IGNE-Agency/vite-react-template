import React, {
	createContext,
	useContext,
	useEffect,
	useState
} from "react";

type PageTitleContext = Readonly<{
	title: string;
	useTitle: (title: string, deps?: any) => void;
}>;

const PageTitleContext =
	createContext<PageTitleContext>({
		title: "",
		useTitle: () => {}
	});

export const PageTitleProvider: React.FC<{
	children: React.ReactNode;
	name: string;
}> = ({ children, name }) => {
	const [title, setTitle] = useState("");

	const useTitle = (title: string, deps: any) => {
		const before = document.title;
		useEffect(() => {
			setTitle(title);
			document.title = title + " | " + name;
			return () => {
				document.title = before;
			};
		}, [deps].flat(Infinity));
	};

	return (
		<PageTitleContext.Provider
			value={{ title, useTitle }}>
			{children}
		</PageTitleContext.Provider>
	);
};

export const usePageTitleContext = () => {
	const context = useContext(PageTitleContext);

	if (!context) {
		throw new Error(
			"usePageTitle must be used within a PageTitleProvider"
		);
	}

	return context;
};

export const usePageTitle = (
	title: string,
	deps: any
) => {
	const context = usePageTitleContext();
	context.useTitle(title, deps);
	return context.title;
};
