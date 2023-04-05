---
title: How to contribute
---

If you want to contribute to this documentation, here are the steps you can follow:

## 1. Fork the repository

To fork a repository, navigate to the [repository page](https://github.com/GaijinEntertainment/GaijinApplicationPlatform) and click the **Fork** button in the top-right corner of the page. This creates a copy of the GAP repository on your _own_ GitHub account, which you can modify without affecting the original repository.

## 2. Make necessary changes

Once you have forked the repository, you can make changes to it. You can do this by cloning the repository to your local machine and making changes using your favorite text editor or IDE.

:::info
The documentation portal is built with [Docusaurus](https://docusaurus.io), a framework that optimizes documentation creation. If you’re not familiar with Docusaurus, it’s recommended to check out the [documentation](https://docusaurus.io/docs) on their website to better understand Docusaurus, how it works, its structure, and more details.
:::

The main language of the documentation is English. All translation data for each locale is stored in `i18n/[locale]` folder. More about internationalization support [read here](https://docusaurus.io/docs/i18n/introduction).

After you have made your changes, you should test them to make sure they look as intended.

### Running the development server

To preview your changes as you edit the files, you can run a local development server that will serve website and reflect the latest changes.

First of all, run your package manager's install command:

```bash
npm install
# or
yarn install
```

And then run start the site in watch mode:

```bash
npm run start
# or
yarn run start
```

Browser window will open at [http://localhost:3000](http://localhost:3000).

:::info
If you make changes to the localized version of the documentation, you should run the development server as follows:

```bash
npm run start -- --locale ru
# or
yarn run start --locale ru
```

:::

### Deploying to GitHub Pages

GAP repository uses the [GitHub Pages](https://docs.github.com/en/pages) experience with [GitHub Actions](https://docs.github.com/en/actions) to deploy the website.

Enable this experience in GitHub repository page: _Settings_ → _Pages_ → _Build and deployment_ → _Source_ by selecting "GitHub Actions" instead of the legacy "Deploy from a branch" option.

In GitHub repository page open at _Settings_ → _Environments_ you should see a GitHub Environment named `github-pages`.

## 3. Create a Pull Request

When you are ready to contribute your changes back to the original repository, you can create a pull request for review and approval.

To create a pull request, navigate to your forked repository on GitHub and click the _Contribute_ → **Open pull request** button. From there, you can select the branch you want to merge into the original repository and add a description of your changes.

Once you have created the pull request, the repository owner will receive a notification and can review your changes. They may request changes or ask for additional documentation before merging your changes into the main branch of the repository.
