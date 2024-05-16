---
title: How to contribute
---

If you want to contribute to this documentation, here are the steps you can follow:

## 1. Fork the repository

To fork a repository, navigate to the [repository page](https://github.com/GaijinEntertainment/GaijinApplicationPlatform) and click the **Fork** button in the top-right corner of the page. This creates a copy of the GAP repository on your _own_ GitHub account, which you can modify without affecting the original repository.

## 2. Make necessary changes

Once you have forked the repository, you can make changes to it. You can do this by cloning the repository to your local machine and making changes using your favorite text editor or IDE.

!!!info
    The documentation portal is built with [MkDocs](https://www.mkdocs.org/), a fast, simple and downright gorgeous static site generator that's geared towards building project documentation. Documentation source files are written in Markdown, and configured with a single YAML configuration file.

The main language of the documentation is English. Update on how to translate this documentation will follow.

After you have made your changes, you should test them to make sure they look as intended.

### Running the development server

To preview your changes as you edit the files, you can run a local development server that will serve website and reflect the latest changes.

Please follow MkDocs' [Installation Guide](https://www.mkdocs.org/user-guide/installation/) to install MkDocs locally.

Then install additional dependencies we use in our docs.

```bash
pip install -r requirements.txt
```

And then start mkdocs internal server:

```bash
mkdocs serve
```

You will see some lines of output ending with
```
INFO    -  Documentation built in 0.39 seconds
INFO    -  [17:06:49] Watching paths for changes: 'docs', 'mkdocs.yml'
INFO    -  [17:06:49] Serving on http://127.0.0.1:8000/
```

Point your browser to the address in the output above ([http://127.0.0.1:8000/](http://127.0.0.1:8000/) in our example).

### Using internal links

When using internal links, we strongly recommend the following rules:

- Link to pages **by file name** (including `.md` extensions).

  ```
  [Apple](apple.md)
  ```

- **Use relative paths** instead of absolute paths
  ```
  [Apple](apple.md)
  [Banana](subfolder/banana.md)
  [Cherry](../cherry.md)
  ```

For more information you can read [here](https://www.mkdocs.org/user-guide/writing-your-docs/#internal-links).

### Generating OpenAPI documentation

WIP

### Deploying to GitHub Pages

GAP repository uses the [GitHub Pages](https://docs.github.com/en/pages) experience with [GitHub Actions](https://docs.github.com/en/actions) to deploy the website.

Enable this experience in GitHub repository page: _Settings_ → _Pages_ → _Build and deployment_ → _Source_ by selecting "GitHub Actions" instead of the legacy "Deploy from a branch" option.

In GitHub repository page open at _Settings_ → _Environments_ you should see a GitHub Environment named `github-pages`.

## 3. Create a Pull Request

When you are ready to contribute your changes back to the original repository, you can create a pull request for review and approval.

To create a pull request, navigate to your forked repository on GitHub and click the _Contribute_ → **Open pull request** button. From there, you can select the branch you want to merge into the original repository and add a description of your changes.

Once you have created the pull request, the repository owner will receive a notification and can review your changes. They may request changes or ask for additional documentation before merging your changes into the main branch of the repository.
