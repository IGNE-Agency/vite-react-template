# Vite React Template

A template for quick-starting any React app.

<details>
<summary>Table of Contents</summary>

- [Vite React Template](#vite-react-template)
  - [🏃‍♂️ Getting started](#️-getting-started)
    - [🟢 OpenAPI](#-openapi)
    - [💻 Editor setup](#-editor-setup)
    - [🧹 Linting \& Formatting](#-linting--formatting)
    - [Ready](#ready)
  - [🚀 Deployments](#-deployments)
    - [🔁 Github Workflows](#-github-workflows)
    - [🛠️ DIY](#️-diy)

</details>

## 🏃‍♂️ Getting started

To run this project, [use `bun`](https://bun.sh/):

```sh
# Install dependencies
bun install
```

### 🟢 OpenAPI

Before you start developing, make sure you have generated the necessary schemas and validators from your OpenAPI spec:

```sh
# Run code generators for API schemas and validators
bun run openapi
```

This will read `./openapi.json` and generate `./src/lib/schema.gen.d.ts` and `./src/lib/validators.gen.ts`. These two files provide typesafe API clients and form validators.

> [!IMPORTANT]
> The provided spec is an example. You should delete `openapi.json`, and reference your own OpenAPI specification by changing the command in `./package.json`:
>
> ```jsonc
> // package.json
> {
> 	"scripts": {
> 		"openapi": "bunx --bun openapi-typescript <PATH_OR_URL_TO_YOUR_OPENAPI_SPEC_JSON> -o ./src/lib/schema.gen.d.ts && bun run generate-schemas.ts <PATH_OR_URL_TO_YOUR_OPENAPI_SPEC_JSON> ./src/lib/validators.gen.ts",
> 	},
> 	// ...
> }
> ```

### 💻 Editor setup

We [work with VSCode](https://code.visualstudio.com/). Project settings are applied automatically. Make sure you've installed [the Oxc extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) to enable linting and formatting in your editor.

The project uses:

- **[Oxlint](https://oxc.rs/docs/guide/usage/linter)** – Fast, type-aware linting (config: [`.oxlintrc.jsonc`](./.oxlintrc.jsonc))
- **[Oxfmt](https://oxc.rs/docs/guide/usage/formatter)** – Formatting for JS, TS, JSON, SCSS, HTML, Markdown, and more (config: [`.oxfmtrc.jsonc`](./.oxfmtrc.jsonc))

For other editors, ensure they support Oxc or configure them to run `oxlint` and `oxfmt` accordingly.

### 🧹 Linting & Formatting

Run linting and formatting checks manually:

```sh
# Lint with type-aware rules
bun run lint
```

Pre-commit hooks via [Lefthook](https://github.com/evilmartians/lefthook) automatically run these checks on staged files.

### Ready

Now you're ready for takeoff!

Start a developing session with the following command:

```sh
bun run dev
```

## 🚀 Deployments

### 🔁 Github Workflows

Use the provided Github Workflows, just add the last step in [.github/workflows/deploy_develop.yml](.github/workflows/deploy_develop.yml).

### 🛠️ DIY

If you want to do it yourself, run the following command(s):

```sh
# Install the exact versions of each package specified in the lockfile for reproducible installs.
bun install --frozen-lockfile
# If you are deploying for production, remove the mode parameter
bun run build --mode develop
```

The app is now built in `./dist` and ready to be hosted.

> [!IMPORTANT]
> Note that the web app is configured to send requests to the server it's hosted on. This is to prevent CORS issues while developing our projects.
>
> In order to support this, the server must reverse proxy requests according to [the following rules in `vite.config.ts`](./vite.config.ts):
>
> ```
> "/api": "https://api.example.CHANGE_ME.com/api/v1",
> "/oauth2": "https://CHANGE_ME.exampleauthservice.com/v3/oauth2"
> ```
