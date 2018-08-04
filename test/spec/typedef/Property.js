import { throws } from 'assert'
import { equal, deepEqual } from 'zoroaster/assert'
import Property from '../../../src/lib/typedef/Property'

const PropertyFromXml = {
  'creates a string property'() {
    const p = new Property()
    const content = 'Root directory string.'
    const props = { string: true, name: 'root' }
    p.fromXML(content, props)
    deepEqual(p, {
      type: 'string',
      name: 'root',
      description: content,
    })
  },
  'creates a number property'() {
    const p = new Property()
    const content = 'Browser cache max-age in milliseconds.'
    const props = { number: true, name: 'maxage', default: 0, opt: true }
    p.fromXML(content, props)
    deepEqual(p, {
      hasDefault: true,
      type: 'number',
      name: 'maxage',
      description: content,
      default: 0,
      optional: true,
    })
  },
  'creates a boolean property'() {
    const p = new Property()
    const content = 'Allow transfer of hidden files.'
    const props = { boolean: true, name: 'hidden', default: false }
    p.fromXML(content, props)
    deepEqual(p, {
      hasDefault: true,
      optional: true,
      type: 'boolean',
      name: 'hidden',
      description: content,
      default: false,
    })
  },
  'creates a custom type property'() {
    const p = new Property()
    const content = 'Function to set custom headers on response.'
    const name = 'setHeaders'
    const type = 'SetHeaders'
    const props = { name, type, opt: true }
    p.fromXML(content, props)
    deepEqual(p, {
      type,
      name,
      description: content,
      optional: true,
    })
  },
  'creates any type property'() {
    const p = new Property()
    const content = 'Configuration from the database.'
    const name = 'config'
    const props = { name }
    p.fromXML(content, props)
    deepEqual(p, {
      type: '*',
      name,
      description: content,
    })
  },
  'throws an error when no name is given'() {
    const p = new Property()
    throws(() => {
      p.fromXML('test', {})
    }, 'Property does not have a name.')
  },
}

class context {
  get desc() {
    return 'Test description.'
  }
  /** Property name. */
  get name() {
    return 'test'
  }
  get p() {
    return new Property()
  }
  get type() {
    return 'Type'
  }
  /** The parent parameter, e.g., `config` in `@param {string} config.param` */
  get parentParam() {
    return 'config'
  }
}

/** @type {Object.<string, Object.<string, (c: context )>>} */
const PropertyToPropParam = {
  context,
  'writes a string property': {
    'required'({ p, name, desc, parentParam }) {
      const props = { string: true, name }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {string} ${name} ${desc}`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {string} ${parentParam}.${name} ${desc}`)
    },
    'optional'({ p, name, desc, parentParam }) {
      const props = { string: true, name, opt: true }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {string} [${name}] ${desc}`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {string} [${parentParam}.${name}] ${desc}`)
    },
    'default'({ p, name, desc, parentParam }) {
      const d = 'test'
      const props = { string: true, name, default: d }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {string} [${name}="${d}"] ${desc} Default \`${d}\`.`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {string} [${parentParam}.${name}="${d}"] ${desc} Default \`${d}\`.`)
    },
  },
  'writes a boolean property': {
    'required'({ p, name, desc, parentParam }) {
      const props = { boolean: true, name }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {boolean} ${name} ${desc}`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {boolean} ${parentParam}.${name} ${desc}`)
    },
    'optional'({ p, name, desc, parentParam }) {
      const props = { boolean: true, name, opt: true }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {boolean} [${name}] ${desc}`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {boolean} [${parentParam}.${name}] ${desc}`)
    },
    'default (true)'({ p, name, desc, parentParam }) {
      const props = { boolean: true, name, default: true }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {boolean} [${name}=true] ${desc} Default \`true\`.`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {boolean} [${parentParam}.${name}=true] ${desc} Default \`true\`.`)
    },
    'default (false)'({ p, name, desc, parentParam }) {
      const props = { boolean: true, name, default: false }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {boolean} [${name}=false] ${desc} Default \`false\`.`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {boolean} [${parentParam}.${name}=false] ${desc} Default \`false\`.`)
    },
  },
  'writes a number property': {
    'required'({ p, name, desc, parentParam }) {
      const props = { number: true, name }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {number} ${name} ${desc}`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {number} ${parentParam}.${name} ${desc}`)
    },
    'optional'({ p, name, desc, parentParam }) {
      const props = { number: true, name, opt: true }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {number} [${name}] ${desc}`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {number} [${parentParam}.${name}] ${desc}`)
    },
    'default'({ p, name, desc, parentParam }) {
      const d = 10
      const props = { number: true, name, default: d }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {number} [${name}=${d}] ${desc} Default \`${d}\`.`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {number} [${parentParam}.${name}=${d}] ${desc} Default \`${d}\`.`)
    },
  },
  'writes a custom type property': {
    'required'({ p, name, desc, parentParam, type }) {
      const props = { name, type }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {${type}} ${name} ${desc}`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {${type}} ${parentParam}.${name} ${desc}`)
    },
    'optional'({ p, name, desc, parentParam, type }) {
      const props = { name, type, opt: true }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {${type}} [${name}] ${desc}`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {${type}} [${parentParam}.${name}] ${desc}`)
    },
    'default'({ p, name, desc, parentParam, type }) {
      const d = 'hello-world'
      const props = { name, type, default: d }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {${type}} [${name}="${d}"] ${desc} Default \`${d}\`.`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {${type}} [${parentParam}.${name}="${d}"] ${desc} Default \`${d}\`.`)
    },
  },
  'writes any type property': {
    'required'({ p, name, desc, parentParam }) {
      const props = { name }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {*} ${name} ${desc}`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {*} ${parentParam}.${name} ${desc}`)
    },
    'optional'({ p, name, desc, parentParam }) {
      const props = { name, opt: true }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {*} [${name}] ${desc}`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {*} [${parentParam}.${name}] ${desc}`)
    },
    'default'({ p, name, desc, parentParam }) {
      const props = { name, default: true }
      p.fromXML(desc, props)
      const prop = p.toProp()
      equal(prop, ` * @prop {*} [${name}=true] ${desc} Default \`true\`.`)
      const param = p.toParam(parentParam)
      equal(param, ` * @param {*} [${parentParam}.${name}=true] ${desc} Default \`true\`.`)
    },
  },
}

const T = {
  'property from xml': PropertyFromXml,
  'property to prop/param': PropertyToPropParam,
}

export default T