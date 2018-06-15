import Context from '../context'
import SnapshotContext from 'snapshot-context'
import createReplaceStream from '../../src/lib/replace-stream'

const args = `
The program accepts the following arguments:

\`\`\`table
[
  ["arg", "description"],
  ["-f", "Display only free domains"],
  ["-z", "A list of zones to check"]
]
\`\`\`
`

const codeBlock = `
\`\`\`
const t = 'new test value: '
const s = t + 'test'
console.log(s)
\`\`\`
`

const comment = '<!-- hello world -->'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces tables correctly'({ SNAPSHOT_DIR, createReadable, catchment }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const rs = createReadable(args)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('tables.md', res.trim())
  },
  async 'replaces multiple tables correctly'({ SNAPSHOT_DIR, createReadable, catchment }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const rs = createReadable(`${args}\n${args}`)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('tables-multiple.md', res.trim())
  },
  async 'replaces tables if there are code blocks'({ SNAPSHOT_DIR, createReadable, catchment }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const rs = createReadable(`${args}\n${codeBlock}`)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('tables-code.md', res.trim())
  },
  async 'removes comments'({ SNAPSHOT_DIR, createReadable, catchment }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const t = 'The program will perform the necessary operations.'
    const rs = createReadable(`${t}\n${comment}`)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('comments-strip.md', res.trim())
  },
  async 'adds TOC'({ SNAPSHOT_DIR, createReadable, catchment }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const toc = '## Table of Contents\n### Hello World'
    const t = 'The program will perform the necessary operations.'
    const rs = createReadable(`${t}\n%TOC%`)
    const s = createReplaceStream(toc)
    rs.pipe(s)
    const res = await catchment(s)
    await test('add-toc.md', res.trim())
  },
}

export default T
