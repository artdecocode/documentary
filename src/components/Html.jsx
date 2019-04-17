/** The component to replace markdown with html. */
const Md2Html = ({ children, documentary }) => {
  const codes = {}
  /** @type {import('restream').Rule} */
  const insertInnerCode = documentary.insertInnerCode
  const d = children.trim()
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

export default Md2Html