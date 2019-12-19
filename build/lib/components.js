const { c, b } = require('../../stdlib');
const { competent } = require('../../stdlib');

function loadComponents(components, getDocumentary) {
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
    /**
     * @param {Object} htmlProps
     * @param {import('competent').Meta} meta
     */
    getProps(htmlProps, meta, name) {
      meta.setPretty(true, 100)
      const d = getDocumentary()
      const documentary = new Proxy(d, {
        get(target, p) {
          if (p == 'renderAgain') {
            return meta.renderAgain
          }
          if (p == 'setPretty') {
            return meta.setPretty
          }
          if (p == 'removeLine') {
            return () => {
              meta.removeLine()
              return null
            }
          }
          if (p == 'error') {
            return (err) => {
              const stack = err.stack.replace(err.message, '')
              console.error(b(`<${name}>`, 'yellow'), c(err.message, 'red'))
              console.error(c(stack, 'grey'))
            }
          }
          return target[p]
        },
      })
      return {
        ...htmlProps,
        documentary,
      }
    },
  })
  return [rule]
}

module.exports=loadComponents