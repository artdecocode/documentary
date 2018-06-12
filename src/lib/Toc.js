import { getLink } from '.'
import { Transform } from 'stream'

const re = /^ *(#+) *((?:(?!\n)[\s\S])+)\n/gm

export default class Toc extends Transform {
  /**
   * @param {Object} config
   * @param {boolean} [config.skipLevelOne=true]
   */
  constructor({
    skipLevelOne = true,
  } = {}) {
    super()
    this.skipLevelOne = skipLevelOne
  }
  _transform(buffer, enc, next) {
    let res
    while ((res = re.exec(buffer)) !== null) {
      const [, { length: level }, title] = res
      if (this.skipLevelOne && level == 1) continue
      const link = getLink(title)
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
    next()
  }
}
