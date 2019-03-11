import spawn from 'spawncommand'
import { codeSurround } from '../lib'

/**
 * The component to display the shell command and its output. The child received by the component will be split by new lines to get arguments to the program.
 */
export const shell = async (props) => {
  const {
    command, children, lang = 'sh', err = false,
  } = props
  const a = children.trim().split('\n').map(c => {
    return c.trim()
  })
  const p = spawn(command, a)
  const { stdout, stderr } = await p.promise
  const s = err ? stderr : stdout
  const r = s.trim().replace(/\033\[.*?m/g, '')
  const cmd = codeSurround(`$ ${command} ${a.map(aa => {
    if (/ /.test(aa)) return `"${aa}"`
    return aa
  }).join(' ')}`, 'sh')
  const output = codeSurround(r, lang)
  return `${cmd}\n\n${output}`
}