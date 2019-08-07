const { createReadStream, lstatSync } = require('fs');
const { spawn } = require('../../stdlib');
const { collect } = require('../../stdlib');
const { Pedantry } = require('../../stdlib');
const tableRule = require('./rules/table');
const titleRule = require('./rules/method-title');
const { PassThrough } = require('stream');

const getLink = (title, prefix = '') => {
  const l = title
    .replace(/<\/?\w+>/g, '')
    .replace(/<br\/>/g, '')
    .replace(/&nbsp;/g, '')
    .replace(/[^\u00C0-\u1FFF\u2C00-\uD7FF\w\-\d ]/gu, '')
    .toLowerCase()
    .replace(/[, ]/g, '-')
  return `${prefix}${prefix ? '-' : ''}${l}`
}

const makeARegexFromRule = (rule) => {
  const re = new RegExp(`^${rule.re.source}`)
  return re
}

const exactTable = makeARegexFromRule(tableRule)
const exactMethodTitle = makeARegexFromRule(titleRule)

const read = async (source) => {
  const rs = createReadStream(source)
  const data = await collect(rs)
  return data
}

/**
 * Create an input stream for all data.
 * @param {string} path Path to the directory or file.
 * @param {boolean} [reverse=false] If directory, read in reverse order.
 * @param {boolean} [object=false] Read in the object mode to push filenames.
 */
const getStream = (path, reverse, object = true) => {
  const ls = lstatSync(path)
  let stream
  if (ls.isDirectory()) {
    stream = new Pedantry(path, {
      reverse,
      addBlankLine: true,
      includeFilename: object,
    })
  } else if (ls.isFile()) {
    stream = new PassThrough({
      objectMode: object,
    })
    const rs = createReadStream(path)
    rs.on('data', (data) => {
      if (object) {
        stream.push({ file: path, data: `${data}` })
      } else {
        stream.push(data)
      }
    }).on('close', () => {
      stream.end()
    })
  }
  return stream
}

const gitPush = async (source, output, message, files = []) => {
  const { promise } = spawn('git', ['log', '--format=%B', '-n', '1'])
  const { stdout } = await promise
  const s = stdout.trim()
  if (s == message) {
    await git('reset', 'HEAD~1')
  }
  await git('add', source, output, ...files)
  const res = await git('commit', '-m', message)
  if (res.code != 0) return
  await git('push', '-f')
}

const git = async (...args) => {
  const { promise } = spawn('git', args, { stdio: 'inherit' })
  return await promise
}

const codeSurround = (content, lang = '') => {
  if (lang == 'md') lang = 'markdown'
  const hasBackticks = /```/.test(content)
  const t = hasBackticks ? '````' : '```'
  return `${t}${lang}\n${content}\n${t}`
}

module.exports.getLink = getLink
module.exports.makeARegexFromRule = makeARegexFromRule
module.exports.exactTable = exactTable
module.exports.exactMethodTitle = exactMethodTitle
module.exports.read = read
module.exports.getStream = getStream
module.exports.gitPush = gitPush
module.exports.git = git
module.exports.codeSurround = codeSurround