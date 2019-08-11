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
    getProps(htmlProps, meta) {
      meta.setPretty(true, 100)
      const documentary = getDocumentary()
      documentary.renderAgain = meta.renderAgain
      documentary.setPretty = meta.setPretty
      return {
        ...htmlProps,
        documentary,
      }
    },
  })
  return [rule]
}

module.exports=loadComponents