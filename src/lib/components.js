import rexml from 'rexml'
import render from '@depack/render'

export const makeComponentRe = (key) => {
  const re = new RegExp(`( *)(<${key}(\\s+.*?)?(\\s*?/>|[\\s\\S]*?<\\/${key}>))`, 'gm')
  return re
}

function loadComponents(components) {
  const compsReplacements = Object.keys(components)
    .map((key) => {
      const instance = components[key]
      const re = makeComponentRe(key)
      const replacement = async function (m, pad, Component) {
        const [{ content, props }] = rexml(key, Component)
        const hyperResult = await instance({
          ...props,
          children: content,
        })
        if (typeof hyperResult == 'string')
          return hyperResult
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