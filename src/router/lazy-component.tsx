import LoadingIndicator from "components/loading-indicator/loading-indicator";
import {
	type ComponentProps,
	type ComponentType,
	lazy,
	Suspense,
	type SuspenseProps,
} from "react";

// biome-ignore lint/suspicious/noExplicitAny: Component can accept any props
type Props = any;

type Loader<Props extends {}> = () => Promise<{
	// Always use default export. See examples how to use on non-default exported component.
	default: ComponentType<Props>;
}>;

type LazyOptions = Readonly<{
	// For custom loader (eg. skeleton) pass null for no loader at all
	fallback?: SuspenseProps["fallback"] | null;
}>;

/**
 * Lazy load any component.
 * Tanstack router automatically lazy-loads, but you can still use this for modal content for example.
 * Supports component props & a custom (or no) loader.
 *
 * @example
 * // Lazy load a component
 * // eg. export default Dashboard
 * const Dashboard = lazyComponent(() => import('./pages/dashboard'))
 *
 * @example
 * // Lazy load a component and use a fallback component while loading
 * const Dashboard = lazyComponent(() => import('./pages/dashboard'), { fallback: <Skeleton /> })
 *
 * @example
 * // Lazy load a named exported component
 * // eg. export const Dashbard = () => {}
 * const Dashbard = lazyComponent(() => import('./pages/dashboard').then(mod => ({ default: mod.Dashboard })))
 */
export function lazyComponent<
	TElement extends ComponentType<Props>,
>(loader: Loader<TElement>, options: LazyOptions = {}) {
	const Component = lazy(loader);

	return (props: ComponentProps<TElement>) => (
		<Suspense
			fallback={options.fallback ?? <LoadingIndicator />}
		>
			<Component {...props} />
		</Suspense>
	);
}
