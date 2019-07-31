const { h } = require('preact');
const { SyncReplaceable, makeCutRule, makePasteRule, makeMarkers } = require('restream');

const strongReplacer = '<strong>$1</strong>'
const emReplacer = '<em>$1</em>'

/** The component to replace markdown with html. */
const Md2Html = ({ children, documentary, li = true }) => {
  if (li == 'false') li = false
  /** @type {import('restream').Rule} */
  const insertInnerCode = documentary.insertInnerCode
  /** @type {import('restream').Rule} */
  const [c] = children
  return replace(c, insertInnerCode, { li })
}

const replace = (c, insertInnerCode, { li }) => {
  const codes = {}
  const tocLinks = {} // keep toc-links for toc-links regex
  let s = c.trim()
  const { links } = makeMarkers({
    links: /<a .+?>/g,
  })
  const [cutLinks] = [links].map(r => makeCutRule(r))
  const [pasteLinks] = [links].map(r => makePasteRule(r))

  let d = SyncReplaceable(s, [
    {
      re: /\[(.+?)\]\((.+?)\)/,
      replacement(m, title, href, i) {
        // toc-links regex does not accept a-hrefs
        if (['t-type', 'l-type', 't'].includes(href) || /^#+$/.test(href)) {
          tocLinks[i] = href
          return `<RESTREAM-REPLACE-TOC-LINKS-${i}%%>${title}</RESTREAM-REPLACE-TOC-LINKS>`
        }
        return `<a href="${encodeURI(href)}">${title}</a>`
      },
    },
    cutLinks,
    insertInnerCode,
    {
      re: /`(.+?)`/g,
      replacement(m, code, i) {
        codes[i] = code
        return `%%RESTREAM-REPLACE-${i}%%`
      },
    },
    {
      re: /%%_RESTREAM_(\w+)_REPLACEMENT_(\d+)_%%/g,
      replacement(m, type, i) {
        return `%%-RESTREAM-${type}-REPLACEMENT-${i}-%%`
      },
    },
    {
      re: /__(.+?)__/g,
      replacement: strongReplacer,
    },
    {
      re: /\*\*(.+?)\*\*/g,
      replacement: strongReplacer,
    },
    {
      re: /_(.+?)_/g,
      replacement: emReplacer,
    },
    {
      re: /\*(.+?)\*/g,
      replacement: emReplacer,
    },
    (li ? {
      re: /(^ *)- (.+)$/mg,
      replacement: '$1<li>$2</li>',
    } : {}),
    {
      re: /%%RESTREAM-REPLACE-(\d+)%%/g,
      replacement(m, i) {
        return '<code>' + codes[i] + '</code>'
        // This should probably be done by Documentary at the end.
        // Can store codes' indexes to remember which to serialise back with
        // <code> rather than `.
      },
    },
    {
      re: /<RESTREAM-REPLACE-TOC-LINKS-(\d+)%%>(.+?)<\/RESTREAM-REPLACE-TOC-LINKS>/g,
      replacement(m, i, title) {
        const href = tocLinks[i]
        return `[${title}](${href})`
      },
    },
    {
      re: /%%-RESTREAM-(\w+)-REPLACEMENT-(\d+)-%%/g,
      replacement: '%%_RESTREAM_$1_REPLACEMENT_$2_%%',
    },
    pasteLinks,
  ])

  return d
}

module.exports=Md2Html

module.exports.replace = replace