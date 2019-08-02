const { c, b } = require('../../stdlib');
let competent = require('competent'); if (competent && competent.__esModule) competent = competent.default;

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
    /**
     * @param {Object} htmlProps
     * @param {import('competent').Meta} meta
     */
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

module.exports=loadComponents