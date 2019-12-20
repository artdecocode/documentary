const { join, dirname, relative, parse, sep, resolve } = require('path');
const { parse: parseUrl } = require('url');
const { writeFileSync } = require('fs');
const { c } = require('../../stdlib');
const { getLink } = require('../lib');

function Annotate(wiki, types, gl = ({ name }) => {
  return getLink(name, 'type')
}) {
  const packageJson = require(join(process.cwd(), 'package.json'))
  const { repository } = packageJson
  let github
  if (typeof repository == 'string') {
    const [portal, name] = repository.split(':')
    if (name && portal != 'github') {
      throw new Error('Only GitHub is supported for repositories in package.json.')
    } else if (name) github = name
    else github = repository
  } else {
    const { url } = repository
    const { host, pathname } = parseUrl(url)
    if (host != 'github.com') throw new Error('Only GitHub is supported for repositories in package.json.')
    github = pathname.replace(/\.git$/, '').replace(/^\//, '')
  }
  github = `https://github.com/${github}`
  let t = null
  if (wiki) {
    t = types.filter(({ import: i }) => !i).reduce((acc, type) => {
      const { name, appearsIn, description, originalNs } = type
      const [ai] = appearsIn.map((file) => {
        let rel = relative(dirname(file), file)
        const [bn] = rel.split(sep)
        const { name: n } = parse(bn)
        return n
      })
      const link = gl(type)
      const r = `${ai}#${link}`
      const rr = `${github}/wiki/${r}`
      acc[`${originalNs}${name}`] = {
        link: rr,
        description,
      }
      return acc
    }, {})
  }
  if (t && Object.keys(t).length) {
    let current = {}
    try {
      const r = resolve('typedefs.json')
      delete require.cache[r]
      current = require(r)
    } catch (err) { /* */}
    writeFileSync('typedefs.json', JSON.stringify({ ...current, ...t }, null, 2))
    const newPackageJson = Object.entries(packageJson).reduce((acc, [k, v]) => {
      acc[k] = v
      if (k == 'repository') {
        acc['typedefs'] = 'typedefs.json'
      }
      return acc
    }, {})
    writeFileSync('package.json', JSON.stringify(newPackageJson, null, 2) + '\n')
    console.log('Updated %s with', c('typedefs.json', 'yellow'))
    Object.keys(t).forEach((tt) => {
      console.log(' - %s', tt)
    })
  }
}

module.exports = Annotate