import { ok, equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import { tableRe } from '../../../src/lib/rules/table'
import { innerCodeRe } from '../../../src/lib/rules'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'matches the table with the re'({ table, cloneRe }) {
    const re = cloneRe(tableRe)
    const res = re.test(table)
    ok(res)
  },
  async 'matches inner code with the re'({ cloneRe }) {
    const re = cloneRe(innerCodeRe)
    const res = re.test('`hello world`')
    ok(res)
  },
  async 'does not match ```'({ cloneRe }) {
    const re = cloneRe(innerCodeRe)
    const res = re.test('```')
    ok(!res)
  },
  async 'does not match ````'({ cloneRe }) {
    const re = cloneRe(innerCodeRe)
    const res = re.test('````')
    ok(!res)
  },
  async 'matches `a``'({ cloneRe }) {
    const re = cloneRe(innerCodeRe)
    const res = re.test('`a``')
    ok(res)
  },
  async 'matches ``a`'({ cloneRe }) {
    const re = cloneRe(innerCodeRe)
    const res = re.test('``a`')
    ok(res)
  },
  async 'matches `hello `` abc `` world ` as three'({ cloneRe }) {
    const re = cloneRe(innerCodeRe)
    const matches = []
    let r
    while ((r = re.exec('`hello `` abc `` world `'))) {
      matches.push(r)
    }
    equal(matches.length, 3)
  },
  async 'matches `hello ` ` world ` as two'({ cloneRe }) {
    const re = cloneRe(innerCodeRe)
    const matches = []
    let r
    while ((r = re.exec('`hello ` ` world `'))) {
      matches.push(r)
    }
    equal(matches.length, 2)
  },
  async 'matches ``hello ` and ` world `` as two'({ cloneRe }) {
    const re = cloneRe(innerCodeRe)
    const matches = []
    let r
    while ((r = re.exec('``hello ` and ` world ``'))) {
      matches.push(r)
    }
    equal(matches.length, 2)
  },
  async 'does not match blocks in comments'({ cloneRe }) {
    const re = cloneRe(innerCodeRe)
    const s = `<!-- \`\`\`sh
        doc -t input-source.md [-r] [-o output.md]
        \`\`\` -->`
    const res = re.test(s)
    ok(!res)
  },
}

export default T
