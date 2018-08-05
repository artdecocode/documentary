import { getPropType, getNameWithDefault } from '.'

class Property {
  constructor() {}
  fromXML(content, { name, string, boolean, opt, number, type, default: def }) {
    if (!name) throw new Error('Property does not have a name.')
    this.name = name
    if (content) this.description = content.trim()
    const t = getPropType({ number, string, boolean, type })
    this.type = t
    if (def !== undefined) this.hasDefault = true
    if (this.hasDefault) this.default = def
    if (opt || this.hasDefault) this.optional = true
  }
  toJSDoc(parentParam) {
    const nameWithDefault = getNameWithDefault(this.name, this.default, this.type, parentParam)
    const name = this.optional ? `[${nameWithDefault}]` : nameWithDefault
    const d = this.hasDefault ? ` Default \`${this.default}\`.` : ''
    const s = `{${this.type}} ${name} ${this.description}${d}`
    return s
  }
  toProp() {
    const s = this.toJSDoc()
    const p = ` * @prop ${s}`
    return p
  }
  toParam(parentParam) {
    const s = this.toJSDoc(parentParam)
    const p = ` * @param ${s}`
    return p
  }
}

export default Property