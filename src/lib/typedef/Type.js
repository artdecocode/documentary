import extractTags from 'rexml'
import Property from './Property'
import { getLink } from '..'

class Type {
  fromXML(content, { name, type, desc, noToc }) {
    if (!name) throw new Error('Type does not have a name.')
    this.name = name

    if (type) this.type = type
    if (desc) this.description = desc.trim()
    if (noToc) this.noToc = true

    if (content) {
      const ps = extractTags('prop', content)
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
  toMarkdown(allTypes = []) {
    const t = this.type ? `\`${this.type}\` ` : ''
    const n = `\`${this.name}\``
    const nn = this.noToc ? n : `[${n}](t)`
    const d = this.description ? `: ${this.description}` : ''
    const line = `${t}__${nn}__${d}`
    const table = makePropsTable(this.properties, allTypes)
    const res = `${line}${table}`
    return res
  }
}

/**
 * @param {Property[]} props
 * @param {*} allTypes
 */
const makePropsTable = (props = [], allTypes = []) => {
  if (!props.length) return ''

  const h = ['Name', 'Type', 'Description', 'Default']
  const ps = props.map((prop) => {
    const link = getLinkToType(allTypes, prop.type)
    const t = `_${prop.type}_`
    const typeWithLink = link ? `[${t}](#${link})` : t
    const name = prop.optional ? prop.name : `__${prop.name}*__`
    const d = !prop.hasDefault ? '-' : `\`${prop.default}\``
    return [name, typeWithLink, prop.description, d]
  })
  const res = [h, ...ps]
  const j = JSON.stringify(res)
  return `

\`\`\`table
${j}
\`\`\``
}

const getLinkToType = (allTypes, type) => {
  const linkedType = allTypes.find(({ name }) => name == type)
  const link = linkedType ? getLink(linkedType.name) : undefined
  return link
}

export default Type