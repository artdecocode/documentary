import Catchment from 'catchment'
import Context, { XmlSnapshot } from '../../context'
import extractTypedef from '../../../src/bin/run/extract'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, XmlSnapshot],
  async 'extracts types from a file'({ typedefJsPath: source }) {
    const writable = new Catchment()
    await extractTypedef({
      writable,
      source,
    })
    const c = await writable.promise
    return c
  },
  async 'extracts properties without descriptions'({ typedefJsPropPath: source }) {
    const writable = new Catchment()
    await extractTypedef({
      writable,
      source,
    })
    const c = await writable.promise
    return c
  },
}

export default T
