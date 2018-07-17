### File Splitting

`documentary` can read a directory and put files together into a single `README` file. The files will be sorted in alphabetical order, and their content merged into a single stream. The `index.md` and `footer.md` are special in this respect, so that the `index.md` of a directory will always go first, and the `footer.md` will go last.

Example structure used in this project:

%TREE documentary%
