const propRe = / \* @prop(?:erty)? .+\n/

const typedefRe = new RegExp(`^ \\* @typedef {(.+?)} (.+?)(?: (.+))?\\n((?:${propRe.source})*)`, 'gm')

module.exports=typedefRe