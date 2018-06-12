import { equal, throws } from 'zoroaster/assert'
import Context from '../context'
// import { toc } from '../../src'
import { getLink } from '../../src/lib'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    // equal(typeof , 'function')
  },
  async 'calls package without error'() {
    // await documentary()
  },
  async 'generates table of contents'() {
  //   const res = toc(structure)

  },
  async 'strings the br tags'() {
    const link = getLink('`koa2Jsx({`<br/>&nbsp;&nbsp;`reducer: function,`<br/>&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;`render?: function,`<br/>`}): function`')
    const message = 'koa2jsxreducer-functionview-containeractions-objectstatic-boolean--truerender-function-function'
    // equal(link, expected)
    await throws({
      async fn() {
        throw new Error(link)
      },
      message,
    })
    //
    // koa2jsxbrnbspnbspreducer-functionbrnbspnbspview-containerbrnbspnbspactions-objectbrnbspnbspstatic-boolean--truebrnbspnbsprender-functionbr-function
  },
}

export default T
