import { c, b } from 'erte'
import competent from 'competent'

function loadComponents(components, options = {}) {
  const rule = competent(components, {
    onFail(key, err) {
      console.error(`Could not process component ${b(`<${key}>`, 'magenta')}:`)
      const reg = new RegExp(`^ +at ${key} .+`, 'm')
      let i
      const stack = err.stack.replace(reg, (mm, j) => {
        i = j + mm.length
        return mm
      }).slice(0, i)
      console.error(`${c(stack, 'red')}`)
    },
    getProps(htmlProps, meta) {
      meta.setPretty(true, 100)
      return {
        ...htmlProps,
        documentary: {
          ...options,
          ...meta,
        },
      }
    },
  })
  return [rule]
}

export default loadComponents