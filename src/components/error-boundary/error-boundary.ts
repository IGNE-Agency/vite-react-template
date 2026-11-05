import {
	Component,
	type ErrorInfo,
	type ReactNode,
} from "react";

type ErrorBoundaryProps = Readonly<{
	children: ReactNode;
	fallback: (error: Error) => ReactNode;
}>;

type ErrorBoundarystate = Readonly<{
	error?: Error;
}>;

class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundarystate
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {};
	}

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	// Unused until the project reports errors somewhere. Remove if not used.
	componentDidCatch(_error: Error, _info: ErrorInfo) {
		// Maybe do some analytics here
	}

	render() {
		if (this.state.error) {
			return this.props.fallback(this.state.error);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
