## processes wiki
../result/wiki/data -W .

/* expected */
# index.md

This is the wiki page.

# home.md

Welcome to _Documentary_!
/**/

## processes wiki and focuses on a page
../result/wiki/data -f index.md -W .

/* expected */
# index.md

This is the wiki page.
/**/

## processes wiki and focuses on pages
../result/wiki/data -f index.md,home.md -W .

/* expected */
# index.md

This is the wiki page.

# home.md

Welcome to _Documentary_!
/**/