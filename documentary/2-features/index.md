## Key Features

<!-- The processed `README.md` file will have a generated table of contents, markdown tables and neat titles for API method descriptions, as well as other possible features described in this section. -->

This section has a quick look at the best features available in _Documentary_ and how they help the documentation process.

```table
[
  ["Feature", "Description", "Advantages"],
  [
    "*Examples*",
    "Allows to embed the source code into documentation.",
    "1. Increases productivity by eliminating the need to copy and paste the source code.<br/>2. Can run examples as Node.js scripts and check that they are working correctly (see forks below)."
  ],
  [
    "*Forks*",
    "Makes it possible to run an example and embed its output directly into documentation.",
    "1. Enhances productivity by eliminating the need to copy and paste the output.<br/>2. Makes sure the output is always up-to-date with documented one.<br/>3. Will make it visible if a change to the code base lead to a different output (implicit part of regression testing).<br/>4. Ensures that the example is actually working."
  ],
  [
    "*Tables*",
    "Compiles tables from arrays without having to write html or markdown.",
    "1. Removes the need to manually build tables either by hand, online or using other tools.<br/>2. Provides table macros to reduce repetitive information and substitute only the core data into templates."
  ],
  [
    "*Typedefs*",
    "Maintains a types.xml file to place types definition in it, available both for source code and documentation.",
    "1. Keeps the types declarations in one place, allowing to quickly update it both in JavaScript JSDoc, and in markdown README.<br/>2. Automatically constructs type tables for documentation.<br/>3. Expands the JSDoc config (options) argument for other developers to have a quick glance at possible options."
  ]
]
```