import rexml from 'rexml'
import render from 'preact-render-to-string'

function loadComponents(components) {
  const compsReplacements = Object.keys(components)
    .map((key) => {
      const re = new RegExp(`( *)(<${key}(\\s+.*)?(/>|[\\s\\S]*?<\\/${key}>))`, 'gm')
      const replacement = function (m, pad, Component) {
        const [{ content, props }] = rexml(key, Component)
        const instance = components[key]
        const hyperResult = instance({
          ...props,
          children: content,
        })
        const r = render(hyperResult)
        const f = r.replace(/^/gm, pad)
        return f
      }
      const rule = { re, replacement }
      return rule
    })
  return compsReplacements
}

export default loadComponents