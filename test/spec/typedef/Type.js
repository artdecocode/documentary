import { throws } from 'assert'
import { equal, deepEqual } from 'zoroaster/assert'
import Type from '../../../src/lib/typedef/Type'

class context {
  /** Name of the type. */
  get name() {
    return 'Type'
  }
  get desc() {
    return 'A test type.'
  }
  get type() {
    return 'Object'
  }
  get t() {
    return new Type()
  }
  get content() {
    const c = `
<prop string name="root">Root directory string.</prop>
<prop number name="maxage" default="0">Browser cache max-age in milliseconds.</prop>
`
      .trim()
    return c
  }
  get paramName() {
    return 'config'
  }
}

/** @type {Object.<string, (c: context)>} */
const TypeFromXml = {
  context,
  'creates a type without properties'({ t, name, desc }) {
    const props = { name, desc, noToc: true }
    t.fromXML('', props)
    deepEqual(t, {
      name,
      noToc: true,
      description: desc,
    })
  },
  'creates a type without description'({ t, name }) {
    const props = { name }
    t.fromXML('', props)
    deepEqual(t, {
      name,
    })
  },
  'creates a type with properties'({ t, name, desc, content }) {
    const props = { name, desc }
    t.fromXML(content, props)
    deepEqual(t, {
      name,
      description: desc,
      properties: [
        {
          name: 'root',
          type: 'string',
          description: 'Root directory string.',
        },
        {
          name: 'maxage',
          type: 'number',
          description: 'Browser cache max-age in milliseconds.',
          hasDefault: true,
          default: 0,
          optional: true,
        },
      ],
    })
  },
  'throws an error when no name is given'({ t }) {
    throws(() => {
      t.fromXML('', {})
    }, 'Type does not have a name.')
  },
}

/** @type {Object.<string, (c: context)>} */
const TypeToTypedef = {
  context,
  'writes a typedef without props'({ t, name, desc }) {
    t.fromXML('', { name, desc })
    const res = t.toTypedef()
    equal(res, ' * @typedef {Object} Type A test type.')
  },
  'writes a typedef with props'({ t, name, desc, content }) {
    t.fromXML(content, { name, desc })
    const res = t.toTypedef()
    const expected = ` * @typedef {Object} Type A test type.
 * @prop {string} root Root directory string.
 * @prop {number} [maxage=0] Browser cache max-age in milliseconds. Default \`0\`.`
    equal(res, expected)
  },
}

/** @type {Object.<string, (c: context)>} */
const TypeToParam = {
  context,
  'writes a param without props'({ t, name, desc, paramName }) {
    t.fromXML('', { name, desc })
    const res = t.toParam(paramName)
    equal(res, ` * @param {${name}} ${paramName} ${desc}`)
  },
  'writes a param with props'({ t, name, desc, content, paramName }) {
    t.fromXML(content, { name, desc })
    const res = t.toParam(paramName)
    const expected = ` * @param {${name}} ${paramName} ${desc}
 * @param {string} ${paramName}.root Root directory string.
 * @param {number} [${paramName}.maxage=0] Browser cache max-age in milliseconds. Default \`0\`.`
    equal(res, expected)
  },
  'writes a spread param'({ t, name, desc, content, paramName }) {
    t.fromXML(content, { name, desc, spread: true })
    const res = t.toParam(paramName)
    const expected = ` * @param {{ root: string, maxage?: number }} ${paramName} ${desc}
 * @param {string} ${paramName}.root Root directory string.
 * @param {number} [${paramName}.maxage=0] Browser cache max-age in milliseconds. Default \`0\`.`
    equal(res, expected)
  },
  'writes a param without expansion'({ t, name, desc, content, paramName }) {
    t.fromXML(content, { name, desc, noExpand: true })
    const res = t.toParam(paramName)
    const expected = ` * @param {${name}} ${paramName} ${desc}`
    equal(res, expected)
  },
}

/** @type {Object.<string, (c: context)>} */
const TypeToMarkdown = {
  context,
  'writes a markdown without props'({ t, name, desc }) {
    t.fromXML('', { name, desc })
    const res = t.toMarkdown()
    equal(res, '__[`Type`](t)__: A test type.')
  },
  'writes a markdown with a type'({ t, name, desc, type }) {
    t.fromXML('', { name, desc, type })
    const res = t.toMarkdown()
    equal(res, '`Object` __[`Type`](t)__: A test type.')
  },
  'writes a markdown with props'({ t, name, desc, content }) {
    t.fromXML(content, { name, desc })
    const res = t.toMarkdown()
    const expected = `__[\`Type\`](t)__: A test type.

\`\`\`table
[["Name","Type","Description","Default"],["__root*__","_string_","Root directory string.","-"],["maxage","_number_","Browser cache max-age in milliseconds.","\`0\`"]]
\`\`\``
    equal(res, expected)
  },
}

const T = {
  'type from xml': TypeFromXml,
  'type to typedef': TypeToTypedef,
  'type to param': TypeToParam,
  'type to markdown': TypeToMarkdown,
}

export default T
