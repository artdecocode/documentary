## Installation & Usage

The `doc` client is available after installation. It can be used in a `doc` script of `package.json`, as follows:

```json
{
  "scripts": {
    "doc": "doc documentary -o README.md"
  }
}
```

The first argument, `documentary` is a path to a directory containing source documentation files, or a path to a single file to be processed, e.g., `README-source.md`.

Therefore, to produce an output `README.md`, the following command will be used:

```sh
yarn doc
```

When actively working on documentation, it is possible to use the `watch` mode with `-w` flag, or `-p` flag to also automatically push changes to a remote git repository, merging them into a single commit every time.

%~%