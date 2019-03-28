Documentary
===

%NPM: documentary%

<a href="https://github.com/artdecocode/documentary"><img src="images/LOGO.svg?sanitize=true" width="150" align="left"></a>

_Documentary_ is a command-line tool and a library to manage documentation of Node.js packages. Due to the fact that there is usually a lot of manual labour involved in creating and keeping up-to-date a README document, such as copying examples and the output they produce, there is a need for software that can help automate the process and focus on what is really important. _Documentary_ serves as a pre-processor of documentation and enhances every area of the task of making available quality docs for Node.js (and other languages) packages for fellow developers.

```sh
yarn add -DE documentary
```

%~%

## Key Features

This section has a quick look at the best features available in _Documentary_ and how they help the documentation process.

```table
[
  ["Feature", "Description", "Advantages"],
  [
    "*[Tables Of Contents](#toc-generation)*",
    "Compiles an accurate table of contents for the content.",
    "1. Makes the structure of the document immediately visible to the reader.<br/>2. Allows to navigate across the page easily.<br/>3. Shows problems with incorrect levels structure which otherwise might not be visible.<br/>4. Allows to place anchor links available from the TOC at any level in any place of the README.<br/>5. Can insert section breaks which visually divide the content and allow to navigate back to the top."
  ],
  [
    "*[Examples](#examples-placement)*",
    "Allows to embed the source code into documentation.",
    "1. Increases productivity by eliminating the need to copy and paste the source code manually.<br/>2. Developers can run examples as Node.js scripts to check that they are working correctly and debug them.<br/>3. Examples can also be forked (see below).<br/> 4. It is possible to imports and requires such as `../src` to be displayed as the name of the package."
  ],
  [
    "*[Forks](#embedding-output)*",
    "Makes it possible to run an example and embed its `stdout` and `stderr` output directly into documentation.",
    "1. Enhances productivity by eliminating the need to copy and paste the output by hand.<br/>2. Makes sure the output is always up-to-date with the documented one.<br/>3. Will make it visible if a change to the code base lead to a different output (implicit regression testing).<br/>4. Supports optional caching, so that programs don't have to be re-run each time a change to documentation in a different place is made.<br/>5. Forked modules can use **import** and **export** statements natively, making it very easy to document the output of examples written in modern syntax.<br/>6. Ensures that examples are actually working.<br/>7. Can print usage of CLI tools by forking them with `-h` command."
  ],
  [
    "*[JSX Components](#jsx-components)*",
    "Performs the compilation of custom-defined JSX components into markdown code.",
    "1. Lets to define custom components and reuse them across documentation where needed. <br/>2. Provides a modern syntax to combine markdown and JavaScript. <br/>3. When documentation written in HTML files, the components are documented with `web-components.json` file for the VSCode which will provide autosuggestions for the arguments of the component."
  ],
  [
    "*[Tables](#simple-tables)*",
    "Compiles tables from arrays without having to write html or markdown.",
    "1. Removes the need to manually build tables either by hand, online or using other tools.<br/>2. Provides table macros to reduce repetitive information and substitute only the core data into templates."
  ],
  [
    "*[Macros](#macros)*",
    "Reuses a defined template to place the data into placeholders.",
    "1. Removes the need to copy-paste patterns to different places and change data manually.<br/>2. Maintains an up-to-date version of the template without having to change it everywhere.<br/>3. Reduces the cluttering of the source documentation by noise and helps to focus on important information."
  ],
  [
    "*[Live Push](#automatic-push)*",
    "Detects changes to the source documentation files, re-compiles the output README.md and pushes to the remote repository.",
    "1. The preview is available on-line almost immediately after a change is made. <br/>2. Allows to skip writing a commit message and the push command every time a change is made."
  ],
  [
    "*[Typedefs](#typedef-organisation)*",
    "Maintains a types.xml file to place types definition in it, available both for source code and documentation.",
    "1. Keeps the types declarations in one place, allowing to quickly update it both in JavaScript JSDoc, and in markdown README.<br/>2. Automatically constructs type tables for documentation.<br/>3. Expands the JSDoc config (options) argument for other developers to have a quick glance at possible options when calling a function.<br/>4. Links all types across the whole documentation for quick navigation.<br/>5. If the `types.xml` file or directory is published, other packages can embed it into documentation also, by using _Documentary_."
  ],
  [
    "*[API Method Titles](#method-titles)*",
    "Creates good-looking headers for methods.",
    "1. By writing each argument on new line, makes it easier to understand the signature of a function.<br/>2. Can maintain a separate title for the table of contents to keep things simple there."
  ]
]
```

%~%

## Table Of Contents

%TOC%

%~%