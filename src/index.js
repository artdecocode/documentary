import { Readable, Transform } from 'stream'
/**
 * This is the main package file.
 */
export default async function documentary() {
  console.log('documentary called')
}

/**
 * A nested structure representing levels of headers in the MarkDown file.
 * @param {Readable} structure
 */
// export const toc = (readable) => {
//   // const t = new Tran
//   // return Object.keys(structure)
// }

const re = /^ *(#+) *((?:(?!\n)[\s\S])+)\n/gm
//   replacement: (match, p1, p2) => {
//     const l = p1.length
//     return `<h${l}>${p2}</h${l}>`
//   },
// },

export class Toc extends Transform {
  constructor(md, {
    skipLevelOne = true,
  } = {}) {
    super()
    this.md = md
    this.skipLevelOne = skipLevelOne
    md.pipe(this)
  }
  _transform(buffer, enc, next) {
    let res
    while ((res = re.exec(buffer)) !== null) {
      const [, { length: level }, title] = res
      // console.log(length, title)
      if (this.skipLevelOne && level == 1) continue
      const link = title.replace(/[^\w-\d ]/g, '').toLowerCase().replace(/[, ]/g, '-')
      const t = `[${title}](#${link})`
      let s
      if (level == 2) {
        s = `- ${t}`
      } else {
        const p = '  '.repeat(level - 2)
        s = `${p}* ${t}`
      }
      this.push(s)
      this.push('\n')
    }
    // this.push('ok')
    next()
  }
}

// -i---init-initialise-configuration
// `-I`, `--init`: Initialise Configuration`


// ## Table Of Contents

// - [Settings](#settings)
// - [Reporting](#reporting)
// - [Route 53](#route-53)
// - [CLI](#cli)
//   * [`-I`, `--init`: Initialise Configuration`](#-i---init-initialise-configuration)
//   * [`-v`, `--version`: Print Version](#-v---version-print-version)
//   * [`-h`: help`](#getconfigoptions-object-config)
// - [API](#api)
//   * [`getConfig(options: Object): Config`](#getconfigoptions-object-config)
//   * [`checkDomains(options: Object): Array`](#checkdomainsoptions-object-array)
// - [Security](#security)
// - [Errors and Troubleshooting](#errors-and-troubleshooting)
//   * [`getaddrinfo ENOTFOUND api.namecheap.com`](#getaddrinfo-enotfound-apinamecheapcom-apinamecheapcom443)
