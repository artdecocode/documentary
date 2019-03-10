let rexml = require('rexml'); if (rexml && rexml.__esModule) rexml = rexml.default;
let render = require('@depack/render'); if (render && render.__esModule) render = render.default;

       const makeComponentRe = (key) => {
  const re = new RegExp(`( *)(<${key}(\\s+.*)*(/>|[\\s\\S]*?<\\/${key}>))`, 'gm')
  return re
}

function loadComponents(components) {
  const compsReplacements = Object.keys(components)
    .map((key) => {
      const re = makeComponentRe(key)
      const replacement = async function (m, pad, Component) {
        const [{ content, props }] = rexml(key, Component)
        const instance = components[key]
        const hyperResult = await instance({
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

module.exports=loadComponents

module.exports.makeComponentRe = makeComponentRe