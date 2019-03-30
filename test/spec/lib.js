import { equal } from 'zoroaster/assert'
import mismatch from 'mismatch'
import { getLink } from '../../src/lib'
import { makeComponentRe } from '../../src/lib/components'
import { replaceR } from '../../src/lib/rules/fork'

export const misc = {
  'replaces \\r correctly'() {
    const res = replaceR(`hello world
...\r..?\r.!`)
    equal(res, `hello world
.!?`)
  },
}

/** @type {Object.<string, (c: Context)>} */
export const GetLink = {
  async 'strips the br tags and &nbsp;'() {
    const link = getLink('`koa2Jsx({`<br/>&nbsp;&nbsp;`reducer: function,`<br/>&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;`render?: function,`<br/>`}): function`')
    const message = 'koa2jsxreducer-functionview-containeractions-objectstatic-boolean--truerender-function-function'
    equal(link, message)
  },
  async 'keeps special characters'() {
    const link = getLink('ÀLaNode')
    equal(link, 'àlanode')
  },
  'makes a component re'() {
    const re = makeComponentRe('Footer')
    const res = mismatch(re, '<Footer client="/test"/>', ['ws', 'test'])
    equal(res.length, 1)
    const res2 = mismatch(re, '<Footer/>', ['ws', 'test'])
    equal(res2.length, 1)
  },
  'makes a component re with multiple lines'() {
    const re = makeComponentRe('Footer')
    const res = mismatch(re, `<Footer client="/test"
    clientLogo="test2"/>`, ['ws', 'test'])
    equal(res.length, 1)
  },
  'makes two components of the same kind'() {
    const re = makeComponentRe('Footer')
    const res = mismatch(re, `<Footer client="/test"
    clientLogo="test2"/>
    <Footer client="/test2"
    clientLogo="test3"/>`, ['ws', 'test'])
    equal(res.length, 2)
  },
}
