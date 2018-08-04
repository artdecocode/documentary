import extractTags from 'rexml'
import Property from './Property'

class Type {
  fromXML(content, { name, type, desc }) {
    if (!name) throw new Error('Type does not have a name.')
    this.name = name

    if (type) this.type = type
    if (desc) this.description = desc

    if (content) {
      const ps = extractTags('p', content)
      const props = ps.map(({ content: c, props: p }) => {
        const pr = new Property()
        pr.fromXML(c, p)
        return pr
      })
      this.properties = props
    }
  }
  toTypedef() {
    const t = this.type || 'Object'
    // ${pd ? ` ${pd}` : ''}
    const d = this.description ? ` ${this.description}` : ''
    const s = ` * @typedef {${t}} ${this.name}${d}`
    const p = this.properties ? this.properties.map((pr) => {
      const sp = pr.toProp()
      return sp
    }) : []
    const st = [s, ...p].join('\n')
    return st
  }
  toParam(paramName) {
    const d = this.description ? ` ${this.description}` : ''
    const s = ` * @param {${this.name}} ${paramName}${d}`
    const p = this.properties ? this.properties.map((pr) => {
      const sp = pr.toParam(paramName)
      return sp
    }) : []
    const st = [s, ...p].join('\n')
    return st
  }
}

export default Type