const { h } = require('preact');
/** The component to replace markdown with html. */
const Md2Html = ({ children, documentary }) => {
  /** @type {import('restream').Rule} */
  const insertInnerCode = documentary.insertInnerCode
  const [c] = children
  return replace(c, insertInnerCode)
}

       const replace = (c, insertInnerCode) => {
  const codes = {}
  const d = c.trim()
    .replace(insertInnerCode.re, insertInnerCode.replacement)
    .replace(/`(.+?)`/g, (m, code, i) => {
      codes[i] = code
      return `%%RESTREAM-REPLACE-${i}%%`
    })
    .replace(/__(.+?)__/g, (m, t) => `<strong>${t}</strong>`)
    .replace(/\*\*(.+?)\*\*/g, (m, t) => `<strong>${t}</strong>`)
    .replace(/_(.+?)_/g, (m, t) => `<em>${t}</em>`)
    .replace(/\*(.+?)\*/g, (m, t) => `<em>${t}</em>`)
    .replace(/%%RESTREAM-REPLACE-(\d+)%%/g, (m, i) => {
      return '<code>' + codes[i] + '</code>'
    })
  return d
}

module.exports=Md2Html

module.exports.replace = replace