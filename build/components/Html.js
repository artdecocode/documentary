const { h } = require('preact');
const { SyncReplaceable, makeCutRule, makePasteRule, makeMarkers } = require('restream');

/** The component to replace markdown with html. */
const Md2Html = ({ children, documentary }) => {
  /** @type {import('restream').Rule} */
  const insertInnerCode = documentary.insertInnerCode
  /** @type {import('restream').Rule} */
  const [c] = children
  return replace(c, insertInnerCode)
}

const replace = (c, insertInnerCode) => {
  const codes = {}
  let s = c.trim()
  const { links } = makeMarkers({ links: /<a .+?>.+?<\/a>/g })
  const cutLinks = makeCutRule(links)
  const pasteLinks = makePasteRule(links)

  s = SyncReplaceable(s, [cutLinks])
  let d = s
    .replace(/%%_RESTREAM_(\w+)_REPLACEMENT_(\d+)_%%/g, (m, type, index) => {
      return `%%-RESTREAM-${type}-REPLACEMENT-${index}-%%`
    })
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
    .replace(/%%-RESTREAM-(\w+)-REPLACEMENT-(\d+)-%%/g, (m, type, index) => {
      return `%%_RESTREAM_${type}_REPLACEMENT_${index}_%%`
    })
  d = SyncReplaceable(d, [pasteLinks])
  return d
}

module.exports=Md2Html

module.exports.replace = replace