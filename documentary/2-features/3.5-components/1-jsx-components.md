## **JSX Components**

_Documentary_ lets users define their custom components in the `.documentary` folder both in the project directory and the user's home directory. The components are written using JSX syntax and exported as named functions from `jsx` files. The properties the component receives are extracted from the markdown syntax and passed to the hyperscript constructor (from `preact`).

For example, the user can define their own component in the following way:

%EXAMPLE: .documentary/index.jsx%

And then invoke it in the documentation:

```html
<Sponsor name="Tech Nation Visa Sucks"
         link="https://www.technation.sucks"
         image="sponsor.gif">
Get In Touch To Support Documentary
</Sponsor>
```

The result will be rendered HTML:

<Sponsor name="Tech Nation Visa Sucks"
         link="https://www.technation.sucks"
         image="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif">
Get In Touch To Support Documentary
</Sponsor>

%~ width="15"%