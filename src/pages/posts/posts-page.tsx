import { useQuery } from "@tanstack/react-query";
import Form from "components/form/form";
import Issues from "components/issues/issues";
import LoadingIndicator from "components/loading-indicator/loading-indicator";
import {
	RequestOneTimePassword,
	RequestOneTimePasswordRequestSchema,
} from "lib/api";
import useForm from "lib/form";
import theme from "style/theme.module.scss";
import style from "./posts-page.module.scss";

const PostsPage = () => {
	const form = useForm(RequestOneTimePasswordRequestSchema);

	const postsQuery = useQuery({
		queryKey: ["posts"],
		queryFn: () =>
			fetch("https://jsonplaceholder.typicode.com/posts").then(
				(res) =>
					res.json() as Promise<
						ReadonlyArray<{
							body: string;
							title: string;
							id: number;
							userId: number;
						}>
					>,
			),
	});

	if (postsQuery.isLoading) {
		return <LoadingIndicator />;
	}

	return (
		<>
			<h1>Hello from Posts Page!</h1>
			{postsQuery.data?.map((post) => (
				<div key={post.id} className={style.post}>
					<h2>{post.title}</h2>
					<p>{post.body.slice(0, 20)}...</p>
				</div>
			))}
			<Form
				form={form}
				onSubmit={form.handleSubmit(async (data) => {
					console.log(data);
					const response = await RequestOneTimePassword(data);

					if (!response.ok) {
						return { email: response.error.map(({ message }) => message) };
					}

					console.log(response.data);
				})}
			>
				<input
					className={theme.input}
					type="text"
					name="email"
					aria-invalid={form.invalidFields?.includes("email")}
				/>
				<Issues name="email" form={form} />
				<button type="submit" className={theme.button}>
					Submit
				</button>
			</Form>
		</>
	);
};

export default PostsPage;
