# Contributing to CONTRIBUTING.md

First off, thanks for taking the time to contribute! 

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues


## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
- [Commit Messages](#commit-messages)
- [Join The Project Team](#join-the-project-team)



## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](README.md).

Before you ask a question, it is best to search for existing [Issues](https://github.com/piroar/Project-Ghost-in-the-C/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an Issue.
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (docker, python, nodejs, etc.), depending on what seems relevant.

We will then take care of the issue as soon as possible.



## I Want To Contribute

> ### Legal Notice 
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs


#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](README.md). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [issues](https://github.com/piroar/Project-Ghost-in-the-C/issues) tab.
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
- Stack trace (Traceback)
- OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
- Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
- Possibly your input and the output
- Can you reliably reproduce the issue? And can you also reproduce it with older versions?


#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to <toligramm@gmail.com>.


We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/piroar/Project-Ghost-in-the-C/issues). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).




### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for CONTRIBUTING.md, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.


#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](README.md) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/piroar/Project-Ghost-in-the-C/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.


#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/piroar/Project-Ghost-in-the-C/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux. 
- **Explain why this enhancement would be useful** to most CONTRIBUTING.md users. You may also want to point out the other projects that solved it better and which could serve as inspiration.



### Your First Code Contribution
If you find something interesting, please:
1. Comment on the issue saying you’d like to work on it. This prevents duplicated effort.
2. Wait for confirmation from a maintainer. Sometimes we provide extra context or design hints.
3. Fork the repository.
4. Create a feature branch from main:
```git checkout -b feature/my-new-feature```
5. Implement your changes while following the Styleguides.
6. Add or update tests, if applicable.
7. Manually test your changes to ensure everything works.
8. Open a Pull Request with a clear title, description, and links to related issues.

Once your PR is submitted:
- A maintainer will review it and may request changes.
- After approval, it will be merged into main.

If you get stuck at any point, feel free to ask in the issue — we’re happy to help!

### Improving The Documentation
Documentation improvements of all sizes are welcome, from fixing a single typo to adding whole new sections.

You can contribute by:

- Updating or clarifying the [README.md](/README.md), usage guides, or code comments.
- Improving explanations, examples, code snippets, or diagrams.
- Documenting new functionality added by you or others.
- Fixing inconsistencies or outdated information.

To contribute documentation:

1. Look for existing documentation [issues](https://github.com/piroar/Project-Ghost-in-the-C/issues).
2. If your idea is new, open a short issue explaining it.
3. Make your edits on a dedicated feature branch.
4. Submit a Pull Request summarizing what you changed and why.

Good documentation is essential to helping new users and contributors succeed — thank you!

## Styleguides
Consistency makes the project easier to read, maintain, and debug. Please follow these style conventions:

#### Code Style (General)
- Write clear, maintainable, and readable code.
- Prefer descriptive names for variables, functions, and modules.
- Keep functions small and focused on a single responsibility.
- Avoid unnecessary complexity or premature optimization.
- Use comments to explain why, not what, when the intent is not obvious.

#### Python (Scripts / Tooling)
- Follow [PEP 8](https://peps.python.org/pep-0008/)
- Use type hints where helpful.
- Keep imports clean and organized.

#### Markdown / Documentation
- Use descriptive section headings.
- Wrap lines at approximately 120 characters.
- Verify links, examples, and code snippets.
- Use fenced code blocks (```) for all code examples.

#### GitHub Issues & Pull Requests
- Use descriptive titles.
- Reference issues using #<issue-number>.
- Apply relevant labels when opening PRs (maintainers may adjust as needed).
If in doubt, ask — we prefer giving guidance over rejecting contributions.

### Commit Messages
Clear commit messages help maintainers review your changes and help everyone understand the project history.
Follow this structure:
```
<type>: <short summary>

<optional longer description>
<optional references to issues/PRs>
```
#### Commit Types
Use one of the following prefixes:
- feat - a new feature
- fix - a bug fix
- docs - documentation changes
- style - formatting/linting; no functional changes
- refactor - structural changes without altering behavior
- test - adding or improving tests
- chore - dependency updates, CI changes, maintenance

#### Examples
```feat: add basic container execution engine```
```fix: prevent crash when loading malformed config (#42)```
```docs: update README with docker setup instructions```
```refactor: split interpreter into separate modules```

#### General Guidelines
- Use the imperative mood (“add feature”, not “added feature”).
- Keep the summary line under 72 characters.
- Group logically related changes into a single commit.
- Reference related issues or PRs at the end of the message if applicable.

Maintaining a clean commit history helps with debugging, automation, and release notes.


## Attribution
This guide is based on the [**contributing.md**](https://contributing.md/).
