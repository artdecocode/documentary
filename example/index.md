<!-- Tables Of Contents -->
%TOC%

<!-- Examples with paths renaming -->
%EXAMPLE: example/index.js, ../src => documentary%

<!-- Forks, native with import/export/jsx -->
<fork stderr nocache env="HELLO=WORLD">
  example/index.js
</fork>

<!-- Typedefs with linking -->
<typedef narrow flatten>
  types/index.xml
</typedef>

<!-- Methods with custom heading designs -->
```## runSoftware
[
  ["program", "string"],
  ["config=", "Object"]
]
```

<!-- Section Breaks -->
%~ width="25"%

<!-- JSX Components -->
<my-component package="documentary">
  Checkout https://readme.page
</my-component>
