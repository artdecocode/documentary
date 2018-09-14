#PRO
Underlined
`Titles`
---

Titles written as blocks and underlined with any number of either `===` (for H1) and `---` (for H2), will be also displayed in the table of contents. However, the actual title will appear on a single line.

```md
#PRO
Underlined
`Titles`
---
```

As seen in the [_Markdown Cheatsheet_](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

## Glossary

- **[Online Documentation](t)**: documentation which is accessible online, such as on a GitHub website, or a language reference, e.g., [Node.js Documentation](https://nodejs.org/api/stream.html).
- **[Editor Documentation](t)**: hints available to the users of an IDE, or an editor, in form of suggestions and descriptive hints on hover over variables' names.

## TODO

- [ ] Test using `zoroaster`'s masks.
- [ ] Gather all types across the whole documentation first to be able to independently link them even if they are in separate files.
- [x] Replace the source in example with a `require` call in addition to `import` statement.
- [ ] Implement caching.
- [ ] Trigger compilation whenever an embedded example changes.
- [ ] Purge image cache from CLI (e.g., `curl -X https://github.com/artdecocode/documentary/raw/${BRANCH}${PATH}`)
- [ ] Implement JS-based `tree`.
- [ ] Implement a proper logging system without `NODE_DEBUG`.

## Copyright

(c) [Art Deco][1] 2018

[1]: https://artdeco.bz