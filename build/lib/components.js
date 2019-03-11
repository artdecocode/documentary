let rexml = require('rexml'); if (rexml && rexml.__esModule) rexml = rexml.default;
let render = require('@depack/render'); if (render && render.__esModule) render = render.default;
const { c, b } = require('erte');
// import cleanStack from '@artdeco/clean-stack'

       const makeComponentRe = (key) => {
  const re = new RegExp(`( *)(<${key}(\\s+[\\s\\S]*?)?(\\s*?/>|[\\s\\S]*?<\\/${key}>))`, 'gm')
  return re
}

function loadComponents(components) {
  const compsReplacements = Object.keys(components)
    .map((key) => {
      const instance = components[key]
      const re = makeComponentRe(key)
      const replacement = async function (m, pad, Component) {
        try {
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
        } catch (err) {
          console.error(`Could not process component ${b(`<${key}>`, 'magenta')}:`)
          const reg = new RegExp(`^ +at ${key} .+`, 'm')
          let i
          const stack = err.stack.replace(reg, (mm, j) => {
            i = j + mm.length
            return mm
          }).slice(0, i)
          console.error(`${c(stack, 'red')}`)
          return m
        }
      }
      const rule = { re, replacement }
      return rule
    })
  return compsReplacements
}

module.exports=loadComponents

module.exports.makeComponentRe = makeComponentRe