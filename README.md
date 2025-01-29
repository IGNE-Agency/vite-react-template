# Vite React Template

A template for quick-starting any React app.

<details>
<summary>Table of Contents</summary>

- [Vite React Template](#vite-react-template)
  - [Getting started 🏃‍♂️](#getting-started-️)
    - [Editor setup 💻](#editor-setup-)
  - [Deployments 🚀](#deployments-)
    - [Github Workflows 🔁](#github-workflows-)
    - [DIY 🛠️](#diy-️)
</details>

## Getting started 🏃‍♂️

To run this project, [use `yarn`](https://yarnpkg.com/):

```sh
yarn install # Install dependencies
yarn dev # Start dev server (will open the app automatically)
```

Or, more concisely:
```sh
yarn && yarn dev
```

### Editor setup 💻
We [work with VSCode](https://code.visualstudio.com/). Project settings are applied automatically. Make sure you've installed [the BiomeJS editor extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) to let your editor format files according to [the config in `biome.json`](./biome.json).

For other editors, the same applies: make sure it understands how to format according to the Biome config.

## Deployments 🚀

### Github Workflows 🔁
Use the provided Github Workflows, just add the last step in [.github/workflows/deploy_develop.yml](.github/workflows/deploy_develop.yml).

### DIY 🛠️
If you want to do it yourself, run the following command(s):
```sh
yarn install --frozen-lockfile
yarn build --mode develop # If you are deploying for production, remove the mode parameter
```

The app is now built in `./dist` and ready to be hosted.

> [!IMPORTANT]
> Note that the web app is configured to send requests to the server it's hosted on. This is to prevent CORS issues while developing our projects.
> 
> In order to support this, the server must reverse proxy requests according to [the following rules in `vite.config.ts`](./vite.config.ts):

```
"/api": "https://api.example.CHANGE_ME.com/api/v1",
"/oauth2": "https://CHANGE_ME.exampleauthservice.com/v3/oauth2"
```