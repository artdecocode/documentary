import { equal } from 'zoroaster/assert'
import Context, { MarkdownSnapshot } from '../../context'
import { jsDocRe } from '../../../src/lib/typedef/jsdoc'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'matches the @param JSDoc with description'({ getMatches }) {
    const t = 'StaticConfig'
    const n = 'config'
    const g = `
/**
 * Configure the static middleware.
 * @param {${t}} ${n} Configuration object.
 */
function configure(config) {
  return resolve('test')
}
`
    const { type, name } = getMatches(g, jsDocRe, ['ws', 'type', 'opt', 'name'])
    equal(type, t)
    equal(name, n)
  },
  async 'matches the @param JSDoc without description'({ getMatches }) {
    const t = 'StaticConfig'
    const n = 'config'
    const g = `
/**
 * Configure the static middleware.
 * @param {${t}} ${n}
 */
function configure(config) {
  return resolve('test')
}
`
    const { type, name } = getMatches(g, jsDocRe, ['ws', 'type', 'opt', 'name'])
    equal(type, t)
    equal(name, n)
  },
  async 'matches processed @param JSDoc'({ mismatch }) {
    const g = `
/**
 * Configure the static middleware.
 * @param {StaticConfig} config Configuration object.
 * @param {string} [config.root] The root path.
 * @param {boolean} [config.test=true] Whether to test all files.
 * @param {number} config.offset Select values from this offset.
 * @param {OtherConfig} [otherConfig] Another configuration object.
 * @param {string} [otherConfig.hello] A hello-world example key.
 * @param {boolean} [otherConfig.world=false] A hello-world example value.
 * @param {FinalConfig} finalConfig A final config.
 * @param {OptionalFinalConfig} [optionalFinalConfig] An optional final config.
 */
function configure(config, otherConfig, finalConfig) {
  return resolve('test', otherConfig.hello)
}

/**
 * Configure the inverse static middleware.
 * @param {Config2} config2 Configuration object.
 * @param {string} [config2.relative] The relative path.
 * @param {boolean} [config2.test=false] Whether to test all files.
 */
function configureInverse(config) {
  return resolve('test')
}
`
    const res = mismatch(jsDocRe, g, ['ws', 'type', 'opt', 'name', 'rest'])
    return res
  },
}

export default T
