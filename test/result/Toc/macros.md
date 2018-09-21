// can use a macro
%MACRO test
## $1
%TYPEDEF test/fixture/typedef/types/$2.xml%
%
%USE-MACRO test
<data>test</data>
<data>1</data>
%
%USE-MACRO test
<data>test2</data>
<data>2</data>
%
%USE-MACRO test
<data>test3</data>
<data>3</data>
%

/* expected */
- [test](#test)
  * [`ServerConfig`](#serverconfig)
- [test2](#test2)
  * [`SetHeaders`](#setheaders)
  * [`StaticConfig`](#staticconfig)
- [test3](#test3)
  * [`Type1`](#type1)
  * [`Type2`](#type2)

/**/