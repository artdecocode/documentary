const { h } = require('preact');
const $_shell = require('./shell');
const $_Argufy = require('./Argufy');
const $_Html = require('./Html');
const $_Typedef = require('./Typedef');
const $_fork = require('./fork');
const $_java = require('./java');
// export { default as method } from './method'
// export { default as method } from './Method/index'

module.exports.shell = $_shell
module.exports.argufy = $_Argufy
module.exports.md2html = $_Html
module.exports.typedef = $_Typedef
module.exports.fork = $_fork
module.exports.java = $_java