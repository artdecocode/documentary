import forkRule from '../lib/rules/fork'
import rexml from 'rexml'

const { replacement } = forkRule

export default function Fork({ documentary, children,
  nocache, plain, relative, stderr, lang }) {
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
  const fn = replacement.bind(documentary.documentary)
  const res = fn(null, '', service, stderr, lang, child, {
    stdout: stdoutAnswers,
    stderr: stderrAnswers,
  })
  if (res === null) throw new Error('The component didn\'t work.')
  return res
}