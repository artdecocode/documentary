import { throws } from 'zoroaster/assert'
import { getLink } from '../../src/lib'

/** @type {Object.<string, (c: Context)>} */
export const GetLink = {
  async 'strips the br tags and &nbsp;'() {
    const link = getLink('`koa2Jsx({`<br/>&nbsp;&nbsp;`reducer: function,`<br/>&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;`render?: function,`<br/>`}): function`')
    const message = 'koa2jsxreducer-functionview-containeractions-objectstatic-boolean--truerender-function-function'
    await throws({
      async fn() {
        throw new Error(link)
      },
      message,
    })
  },
}
