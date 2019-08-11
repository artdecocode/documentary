const { h } = require('preact');
const forkRule = require('../lib/rules/fork');
const { rexml } = require('../../stdlib');

const { replacement } = forkRule

/** The component to create forks.
 * @param {Object} opts
 * @param {import('../lib/Documentary').default} opts.documentary
 */
function Fork({ documentary, children,
  nocache, plain, relative, stderr, lang, env = '', noprint,
}) {
  const parsedEnv = env.split(' ').reduce((acc, c) => {
    const [name, val] = c.split('=')
    acc[name] = val
    return acc
  }, {})
  let service = ''
  if (nocache) service += '!'
  if (plain) service += '_'
  if (relative) service += '/'
  /** @type {string} */
  let child = children[0]
  const a = '</answer>'
  let i = child.lastIndexOf(a)
  let stdoutAnswers = []
  let stderrAnswers = []
  if (i != -1) {
    i += a.length
    let answers = child.slice(0, i)
    answers = rexml('answer', child)
    answers.forEach(({ content, props: {
      'regex': regex, 'stderr': e } }) => {
      const answer = [new RegExp(regex), content.trim()]
      if (e) stderrAnswers.push(answer)
      else stdoutAnswers.push(answer)
      return
    })
    child = child.slice(i)
  }
  child = child.trim()
  const fn = replacement.bind(documentary)
  const res = fn(null, '', service, stderr, lang, child, {
    stdout: stdoutAnswers,
    stderr: stderrAnswers,
  }, { parsedEnv, env })
  if (res === null) throw new Error('The component didn\'t work.')
  if (noprint) {
    documentary.log(`Not printing output of ${child}`)
    return null
  }
  return res
}

module.exports = Fork