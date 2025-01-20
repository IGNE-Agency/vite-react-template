type ErrorPageProps = Readonly<{
	error: Error;
}>;

const ErrorPage = ({ error }: ErrorPageProps) => (
	<pre>{error.toString()}</pre>
);

export default ErrorPage;
