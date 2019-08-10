import { SyncReplaceable, makeCutRule, makePasteRule, makeMarkers } from 'restream'

const strongReplacer = '<strong>$1</strong>'
const emReplacer = '$1<em>$2</em>'

/** The component to replace markdown with html.
 * @param {Object} opts
 * @param {import('../lib/Documentary').default} opts.documentary
 */
const Md2Html = ({ children, documentary, li = true, afterCutLinks }) => {
  if (li == 'false') li = false
  const insertInnerCode = documentary.insert.innerCode
  const [c] = children
  return replace(c, insertInnerCode, { li, afterCutLinks })
}

export const replace = (c, insertInnerCode, { li, afterCutLinks = [] }) => {
  const codes = {}
  const tocLinks = {} // keep toc-links for toc-links regex
  let s = c.trim()
  const { tags } = makeMarkers({
    tags: /<\w+ .+?>/g,
  }, {
    getRegex(name) {
      return new RegExp(`%%-HTML-${name.toUpperCase()}-REPLACEMENT-(\\d+)-%%`, 'g')
    },
    getReplacement(name, index) {
      return `%%-HTML-${name.toUpperCase()}-REPLACEMENT-${index}-%%`
    },
  })
  const [cutTags] = [tags].map(r => makeCutRule(r))
  const [pasteTags] = [tags].map(r => makePasteRule(r))

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
    cutTags,
    ...afterCutLinks,
    insertInnerCode,
    {
      re: /`(.*?)`/g,
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
      re: /(^|[^\\])_(.+?)_/g,
      replacement: emReplacer,
    },
    {
      re: /(^|[^\\])\*(.+?)\*/g,
      replacement: emReplacer,
    },
    {
      re: /(^|[^\\])\\([_*])/g,
      replacement: '$1$2',
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
    pasteTags,
  ])

  return d
}

export default Md2Html