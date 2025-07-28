# Vite React Template

A template for quick-starting any React app.

<details>
<summary>Table of Contents</summary>

- [Vite React Template](#vite-react-template)
  - [🏃‍♂️ Getting started](#️-getting-started)
    - [🟢 OpenAPI](#-openapi)
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
> ```jsonc
> // package.json
> {
> 	"scripts": {
> 		"openapi": "bunx --bun openapi-typescript <PATH_OR_URL_TO_YOUR_OPENAPI_SPEC_JSON> -o ./src/lib/schema.gen.d.ts && bun run generate-schemas.ts <PATH_OR_URL_TO_YOUR_OPENAPI_SPEC_JSON> ./src/lib/validators.gen.ts",
> 	},
> 	// ...
> }

### 💻 Editor setup

We [work with VSCode](https://code.visualstudio.com/). Project settings are applied automatically. Make sure you've installed [the BiomeJS editor extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) to let your editor format files according to [the config in `biome.json`](./biome.json).

> [!IMPORTANT]
> Because [Biome pushes for browser standards](https://github.com/biomejs/biome/issues/1285) over custom tooling, [SASS files have to still be formatted using Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode). This is configured by default if you're using VSCode.

For other editors, the same applies: make sure it understands how to format according to the Biome config.

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
