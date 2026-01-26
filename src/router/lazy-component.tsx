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

type Loader<TComponent extends ComponentType<Props>> =
	() => Promise<{
		// Force a default module export type
		default: TComponent;
	}>;

type LazyOptions = {
	// For custom loader (eg. skeleton) pass null for no loader at all
	fallback?: SuspenseProps["fallback"] | null;
};

/**
 * Lazy load any component.
 * Supports component props & a custom (or no) loader.
 *
 * @example
 * // Lazy load a component
 * // eg. export default Dashboard
 * const Dashboard = dynamic(() => import('./pages/dashboard'))
 *
 * @example
 * // Lazy load a component and use a fallback component while loading
 * const Dashboard = dynamic(() => import('./pages/dashboard'), { fallback: <Skeleton /> })
 *
 * @example
 * // Lazy load a named exported component
 * // eg. export const Dashbard = () => {}
 * const Dashbard = dynamic(() => import('./pages/dashboard').then(mod => ({ default: mod.Dashboard })))
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
