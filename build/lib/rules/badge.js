const badgeRe = /^%NPM: ((?:[@\w\d-_.]+\/)?[\w\d-_.]+)%$/gm

const badgeRule = {
  re: badgeRe,
  replacement(match, name) {
    const n = encodeURIComponent(name)
    return `[![npm version](https://badge.fury.io/js/${n}.svg)](https://www.npmjs.com/package/${name})`
  },
}

module.exports=badgeRule

module.exports.badgeRe = badgeRe