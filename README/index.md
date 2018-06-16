# documentary

%NPM: documentary%

`documentary` is a command-line tool and a library to manage documentation of Node.js packages. Due to the fact that complex `README` files are harder to maintain, `documentary` serves as a pre-processor of documentation.

```sh
yarn add -E documentary
```

## Table Of Contents

%TOC%

<!-- It will also include valid URLs used on GitHub to skip to the title when complex titles are given.

When `-r` or `--replace` argument is passed, the `%TOC%` placeholder in the file will be replaced with the generated table of contents. Passing `-o` allows to save the output to the file, otherwise it is printed into the _stdout_.

```sh
doc -t README-source.md -r -o README.md
``` -->

<!-- ```
Saved README.md from README-source.md
``` -->

<!-- The command will also strip any markdown comments (e,g., ). -->

<!-- ### `-l`, `--live`: GitHub Live

With GitHub live, `documentary` will monitor for any happening commits, push them to GitHub, extract the commit version, and refresh the page with open `README.md` file in Chrome browser. This allows to see the preview as it is viewed on GitHub.

```sh
doc live
``` -->

<!-- ### extractStructure(markdown: string): object -->

<!-- ### MethodDescriptor

A method descriptor contains meta-information about a method, such as what arguments it takes, of what type, etc.

```js
const md = {
  name: 'methodName',
  arguments: {
    name: {
      type: 'string',
    },
  },
  return: 'string',
}
``` -->

<!-- ### generateTitle(method: MethodDescriptor): string

Generate a title for a method, for example:

-->
