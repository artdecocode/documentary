import SnapshotContext from 'snapshot-context'
import { Replaceable } from 'restream'
import Context from '../../context'
import exampleRule from '../../../src/lib/rules/example'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces an example'(
    { createReadable, catchment, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const r = createReadable(`
\`\`\`
%EXAMPLE: test/spec/fixtures/example.js, ../src => documentary%
\`\`\`
`)
    const rs = new Replaceable(exampleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('rules/example.md', res)
  },
}

export default T
