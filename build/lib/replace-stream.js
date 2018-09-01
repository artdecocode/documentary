const { Replaceable, makeMarkers, makeCutRule, makePasteRule } = require('restream');
const {
  createTocRule, commentRule: stripComments, codeRe, innerCodeRe, linkTitleRe, linkRe,
} = require('./rules');
let tableRule = require('./rules/table'); if (tableRule && tableRule.__esModule) tableRule = tableRule.default; const { tableRe } = tableRule
let methodTitleRule = require('./rules/method-title'); if (methodTitleRule && methodTitleRule.__esModule) methodTitleRule = methodTitleRule.default; const { methodTitleRe } = methodTitleRule
let treeRule = require('./rules/tree'); if (treeRule && treeRule.__esModule) treeRule = treeRule.default;
let exampleRule = require('./rules/example'); if (exampleRule && exampleRule.__esModule) exampleRule = exampleRule.default;
let forkRule = require('./rules/fork'); if (forkRule && forkRule.__esModule) forkRule = forkRule.default;
const { getLink } = require('.');
let gifRule = require('./rules/gif'); if (gifRule && gifRule.__esModule) gifRule = gifRule.default;
let typeRule = require('./rules/type'); if (typeRule && typeRule.__esModule) typeRule = typeRule.default;
let badgeRule = require('./rules/badge'); if (badgeRule && badgeRule.__esModule) badgeRule = badgeRule.default;
let typedefMdRule = require('./rules/typedef-md'); if (typedefMdRule && typedefMdRule.__esModule) typedefMdRule = typedefMdRule.default;

       class DocumentationStream extends Replaceable {
  constructor({ toc }) {
    const tocRule = createTocRule(toc)

    const {
      table, methodTitle, code, innerCode, linkTitle,
    } = makeMarkers({
      table: tableRe,
      methodTitle: methodTitleRe,
      code: codeRe,
      innerCode: innerCodeRe,
      linkTitle: linkTitleRe,
    })

    /* below have ``` in them, therefore we want more control over handling them
    * so that Replaceable does not confuse them with the code blocks.
    */
    const [cutCode, cutTable, cutMethodTitle, cutInnerCode] =
      [code, table, methodTitle, innerCode, linkTitle].map((marker) => {
        const rule = makeCutRule(marker)
        return rule
      })
    const [insertCode, insertTable, insertMethodTitle, insertInnerCode] =
      [code, table, methodTitle, innerCode, linkTitle].map((marker) => {
        const rule = makePasteRule(marker)
        return rule
      })

    super([
      cutInnerCode,
      cutTable,
      cutMethodTitle,
      cutCode,
      stripComments,

      badgeRule,
      treeRule,
      exampleRule,
      forkRule,
      tocRule,
      gifRule,
      typeRule,

      insertTable,
      typedefMdRule, // places a table hence just before table
      tableRule,

      { // a hackish way to update types property tables to include links to seen types.
        re: /\| _(\w+)_ \|/g,
        replacement(match, name) {
          if (!(name in this.types)) return match
          return `| _[${name}](#${getLink(name)})_ |`
        },
      },
      {
        re: linkTitleRe,
        replacement(match, title) {
          const ic = new RegExp(innerCode.regExp.source).exec(title) // test please
          let link
          if (!ic) {
            link = getLink(title)
          } else {
            const [, i] = ic
            const val = innerCode.map[i]
            link = getLink(val)
          }
          return `<a name="${link}">${title}</a>`
        },
      },
      {
        re: linkRe, // make links
        replacement(match, title) {
          // check why is needed to use innerCode re above
          const link = getLink(title)
          return `<a name="${link}">${title}</a>`
        },
      },
      insertMethodTitle,
      methodTitleRule,

      insertCode,
      insertInnerCode,
      // those found inside of code blocks
      insertTable,
      insertMethodTitle,
    ])

    this._types = {}

    this.on('types', types => {
      types.forEach(this.addType.bind(this))
    })
  }
  addType(name) {
    this.types[name] = true
  }
  get types() {
    return this._types
  }
}

               function createReplaceStream(toc) {
  const s = new DocumentationStream({
    toc,
  })

  return s
}

// {
//   re: /[\s\S]*/,
//   replacement(match) {
//     debugger
//     return match
//   },
// },


module.exports = createReplaceStream
module.exports.DocumentationStream = DocumentationStream
//# sourceMappingURL=replace-stream.js.map