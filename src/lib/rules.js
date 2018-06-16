export const badgeRule = {
  re: /^%NPM: (\w\d-_+)$/gm,
  replacement(match, name) {
    return `[![npm version](https://badge.fury.io/js/${name}.svg)](https://npmjs.org/package/${name})`
  },
}
