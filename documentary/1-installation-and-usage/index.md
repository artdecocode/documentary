## Installation & Usage

The `doc` client is available after installation. It can be used in a `doc` script of `package.json`, as follows:

```json
{
  "scripts": {
    "doc": "doc README-source.md -o README.md",
    "dc": "git add README-source.md README.md && git commit -m ",
  }
}
```

Therefore, to run produce an output README.md, the following command will be used:

```sh
yarn doc
```

The `dc` command is just a convenience script to commit both source and output files with a passed commit message, such as:

```sh
yarn dc 'add copyright'
```
