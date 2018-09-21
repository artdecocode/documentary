// can use inside a macro
%MACRO test
%TYPEDEF test/fixture/typedef/types/$1.xml%
%
%USE-MACRO test
<data>1</data>
%
%USE-MACRO test
<data>2</data>
%
%USE-MACRO test
<data>3</data>
%

/* locations */
["test/fixture/typedef/types/1.xml",
 "test/fixture/typedef/types/2.xml",
 "test/fixture/typedef/types/3.xml"]
/**/