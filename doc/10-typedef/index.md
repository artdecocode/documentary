## **`@typedef` Organisation**

For the purpose of easier maintenance of _JSDoc_ `@typedef` declarations, _Documentary_ allows to keep them in a separate XML file, and then place compiled versions into both source code as well as documentation. By doing this, more flexibility is achieved as types are kept in one place but can be reused for various purposes across multiple files. It is different from _TypeScript_ type declarations as _Documentary_ will generate _JSDoc_ comments rather than type definitions which means that a project does not have to be written in _TypeScript_.

Types are kept in a separate `xml` file, for example:

%EXAMPLE: types/static.xml%

They are then included in both JavaScript source code and markdown documentation.