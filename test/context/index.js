// import { debuglog } from 'util'
import { fork } from 'spawncommand'
import { resolve, relative } from 'path'
import { unlink, createReadStream } from 'fs'
import { collect } from 'catchment'
import { Readable } from 'stream'
import mismatch from 'mismatch'
import { Replaceable } from 'restream'
import Zoroaster from 'zoroaster'
import Method from '../../src/components/method'
import createReplaceStream  from '../../src/lib/replace-stream'
import Documentary from '../../src/lib/Documentary'

// const LOG = debuglog('doc')
const TEST_BUILD = process.env.ALAMODE_ENV == 'test-build'

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    // LOG('init context')
    await new Promise((r) => {
      unlink(this.OUTPUT, () => {
        r()
      })
    })
  }
  get examplePath() {
    return 'test/fixtures/example.js'
  }
  /**
   * Path to a JavaScript file containing `@typedef`s.
   */
  get typedefJsPath() {
    return resolve(__dirname, '../fixtures/typedef/extract.js')
  }
  /**
   * Path to a JavaScript file containing `@typedef`s.
   */
  get typedefJsPropPath() {
    return resolve(__dirname, '../fixtures/typedef/props.js')
  }
  /**
   * @param {RegExp} re Regular expression to reset.
   */
  resetRe(re) {
    re.lastIndex = -1
  }
  cloneRe(re) {
    return new RegExp(re.source, 'g')
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  /**
   * A path to a temporary file which does not exist at the beginning of test context.
   */
  get OUTPUT() {
    const p = resolve(__dirname, '../fixtures/output.md')
    return p
  }
  async readOutput() {
    const rs = createReadStream(this.OUTPUT)
    const res = await this.catchment(rs)
    return res
  }
  /**
   * Create a readable stream which will push the passed string.
   * Emulates _Pedantry_.
   * @param {string} data The string to push.
   */
  createReadable(data, objectMode = true) {
    const rs = new Readable({
      objectMode,
      read() {
        this.push(objectMode ? { data, file: 'test.md' } : data)
        this.push(null)
      },
    })
    return rs
  }
  mockDoc(rules) {
    const rs = new Replaceable(rules)
    rs.Method = (opts = {}) => {
      return Method({
        ...opts,
        documentary: rs,
      })
    }
    rs.annotateType = () => {}
    rs.addDtoc = () => ''
    rs.log = (...args) => {
      // console.log(args)
      // debugger
    }
    rs.addAsset = () => {}
    return rs
  }
  // get README() {
  //   return
  // }
  /**
   * Path to the source readme file with %TOC% marker for replacement.
   */
  get README_PATH() {
    return 'test/fixtures/README-source.md'
  }
  get readme_path() {
    return 'test/fixtures/README'
  }
  get README_DIR_PATH() {
    return resolve(__dirname, '../fixtures/README')
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
  get FORK_PATH() {
    return 'test/fixtures/fork'
  }
  /**
   * Path to the example file.
   * @example
import documentary from '../src'
import Catchment from 'catchment'

(async () => {
  await documentary()
})()
   */
  get EXAMPLE_PATH() {
    return resolve(__dirname, '../fixtures/example.js')
  }
  get PARTIAL_EXAMPLE_PATH() {
    return resolve(__dirname, '../fixtures/example-part.js')
  }
  /**
   * An example with multiple partials.
   */
  get PARTIAL_EXAMPLE2_PATH() {
    return resolve(__dirname, '../fixtures/example-part-2.js')
  }
  get mismatch() {
    return mismatch
  }
  /**
   * Run the binary.
   * @param {string} input Path to the source readme file
   */
  async doc(input, ...args) {
    const proc = fork(DOC, [input, ...args], {
      stdio: 'pipe',
      execArgv: [],
    })
    const { stdout, stderr } = await proc.promise
    return {
      stdout,
      stderr,
    }
  }
  /**
   * Run the binary.
   * @param {string} input Path to the source readme file
   * @param {!NodeJS.ProcessEnv} env Path to the source readme file
   */
  async docWithEnv(input, env = {}, ...args) {
    const proc = fork(DOC, [input, ...args], {
      stdio: 'pipe',
      execArgv: [],
      env: {
        ...process.env, // pass DOCUMENTARY_SKIP_USER_COMPONENTS
        ...env,
      },
    })
    const { stdout, stderr } = await proc.promise
    return {
      stdout,
      stderr,
    }
  }
  /**
   * A markdown document headers structure, e.g.,
   * `{ hello: [] }
   */
  get structure() {

  }
  async _destroy() {
    // LOG('destroy context')
  }
  /**
   * Catch the output of the stream into a string.
   * @param {Readable} rs
   */
  async catchment(rs, noTrim) {
    const res = await collect(rs)
    return noTrim ? res : res.trim()
  }
  get table() {
    return `
The program accepts the following arguments:

${this.rawTable}
`
  }
  makeTable(...rows) {
    return `
\`\`\`table
${JSON.stringify(rows, null, 2)}
\`\`\``
  }
  get rawTable() {
    return `
\`\`\`table
${this.innerTable}
\`\`\``.trim()
  }
  getRawMethodTitle(isAsync = true, withArgs = true, returns = true) {
    return `\`\`\`### ${isAsync ? 'async ' : ''}runSoftware${returns ? ' => string' : ''}
${withArgs ? this.innerTitle : ''}
\`\`\`
    `.trim()
  }
  get innerTable() {
    return `[
  ["arg", "description"],
  ["-f", "Display only free domains"],
  ["-z", "A list of zones to check"]
]`
  }
  getTitle(a = true, args = true, ret = true) {
    return `## API

${this.getRawMethodTitle(a, args, ret)}`
  }
  get innerTitle() {
    return `[
  ["path", "string"],
  ["config", {
    "View": ["Container"],
    "actions": ["object"],
    "static?": ["boolean", true],
    "render?": ["function"]
  }]
]`
  }
  escapeBackticks(block) {
    return `\`\`\`\`\n${block}\n\`\`\`\``
  }
  get comment() {
    return this.getComment('hello world')
  }
  get codeBlock() {
    const code = `
const t = 'new test value: '
const s = t + 'test'
console.log(s)
    `.trim()
    return this.getCodeBlock(code)
  }
  getComment(body) {
    return `<!-- ${body} -->`
  }
  getCodeBlock(code, lang = '') {
    return `
\`\`\`${lang}
${code}
\`\`\`
`
  }
  get type() {
    return `
<p name="title" type="string" required>
  <d>Question title.</d>
</p>
<p name="validation" type="(async) function">
  <d>Validation Function.</d>
  <e>A function will throw an error if validation does not pass.

\`\`\`js
const q = {
  validation(val) {
    if (!val.length) throw new Error('Name required.')
  }
}
\`\`\`
  </e>
</p>
<p name="postProcess" type="(async) function">
  <e>

\`\`\`js
console.log('test')
\`\`\`
</e>
</p>`
  }

  /**
   * Extract matches from the string using `replace` and return an object with keys.
   * @param {string} s String to find matches in
   * @param {RegExp} re Regular Expression
   * @param {string[]} keys The sequence of keys corresponding to the matches.
   * @return {Object.<string, string>} The parsed matches in a hash.
   * @example
   *
   * export default {
   *  context: Context,
   *  async 'matches the badge snippet'({ getMatches }) {
   *    const p = 'documentary'
   *    const g = `%NPM: ${p}%`
   *    const { pack } = getMatches(g, badgeRe, ['pack'])
   *    equal(pack, p)
   *  },
   * }
   */
  getMatches(s, re, keys) {
    const o = {}
    s.replace(re, (match, ...args) => {
      const p = args.slice(0, args.length - 2)
      for (let i = 0; i < p.length; i++) {
        const a = p[i]
        const c = keys[i]
        if (c || a) o[c] = a
      }
    })
    return o
  }
  assertNoMatch(s, re) {
    let matched = false
    s.replace(re, (match) => {
      matched = match
    })
    if (matched) throw new Error(`The string was matched: ${matched}`)
  }
  countMatches(s, re) {
    let matched = 0
    s.replace(re, () => {
      matched += 1
    })
    return matched
  }
  assertNMatches(s, re, n) {
    const c = this.countMatches(s, re)
    if (c != n) throw new Error(`Expected ${n} matches, but the string was matched ${c} times.`)
  }
  assertSingleMatch(s, re) {
    const c = this.countMatches(s, re)
    if (c != 1) throw new Error(`Expected 1 match, but the string was matched ${c} times.`)
  }
  makeInnerCode(code) {
    const s = `\`${code}\``
    return s
  }
  /** Absolute location of the types fixture. */
  get typesLocation() {
    const r = resolve(__dirname, '../fixtures/typedef/types.xml')
    return relative('', r)
  }
  /** Absolute location of the types with a pipe fixture. */
  get typesPipeLocation() {
    const r = resolve(__dirname, '../fixtures/typedef/types-pipe.xml')
    return relative('', r)
  }
  /**
   * Replace a string using a Replaceable stream.
   * @param {Rule|Rule[]} rule The rule or rules to use.
   * @param {string} s The string to replace.
   */
  async replace(rule, s) {
    const replaceable = new Replaceable(rule)
    replaceable.end(s)
    replaceable.log = () => {}
    const res = await this.catchment(replaceable, true)
    return { res, replaceable }
  }
  /**
   * Returns a reference to a new replace stream.
   */
  get replaceStream() {
    const rs = createReplaceStream()
    return rs
  }
  get DocumentaryNoDToc() {
    return new Documentary({ disableDtoc: true })
  }
  /**
   * Returns a reference to a documentary stream with the full set of rules.
   */
  get Documentary() {
    return Documentary
  }
  /**
   * A JavaScript file which is suitable for generating typedefs, i.e., it has a /* documentary types.xml *\/ marker.
   */
  get generateImports() {
    return resolve(__dirname, '../fixtures/typedef/generate-imports.js')
  }
  /**
   * A JavaScript file has been generated typedefs, i.e., it has a /* documentary types.xml *\/ marker AND the generated JSDoc under it.
   */
  get generateImportsAfter() {
    return resolve(__dirname, '../fixtures/typedef/generate-imports-after.js')
  }
  /**
   * Path to the executable. When testing with `ALAMODE_ENV` set to `test-build`, this will point to `build/bin`, and when testing source code, this will point to `src/bin/alamode`.
   */
  static get DOC() {
    return DOC
  }
}

/** @typedef {import('restream').Rule} Rule */

const BIN = TEST_BUILD ? '../../build/bin/doc' : '../../src/bin'
const DOC = resolve(__dirname, BIN)

export class MarkdownSnapshot extends Zoroaster {
  static get snapshotExtension() { return 'md' }
}
export class JsSnapshot extends Zoroaster {
  static get snapshotExtension() { return 'js' }
}
export class XmlSnapshot extends Zoroaster {
  static get snapshotExtension() { return 'xml' }
}