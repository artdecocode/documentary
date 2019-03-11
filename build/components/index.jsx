let spawn = require('spawncommand'); if (spawn && spawn.__esModule) spawn = spawn.default;
const { exec } = require('child_process');
const { codeSurround } = require('../lib');

/**
 * The component to display the shell command and its output. The child received by the component will be split by new lines to get arguments to the program. When the `command` argument is not passed, then the command is taken from children and executed with `exec` method.
 * @param {ShellProps} props Options for the Shell component. TODO: pass options.
 * @param {string} [props.command] The command to execute using the `child_process`. If the command is not passed, the children will be used to pass to `exec`, e.g., `(echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume.js`.
 * @param {string} [props.language="sh"] The markdown language of the output. Default `sh`.
 * @param {boolean} [props.err=false] Whether to print SDTERR instead of STDOUT (todo: make print both). Default `false`.
 * @param {string} [props.children] The arguments to the program each on new line.
 * @param {boolean} [props.noTrim=false] Whether to disable trim before printing the output. Default `false`.
 * @example
 * <shell>(echo abc; sleep 1; echo def; sleep 1; echo ghi) | node test/fixture/node</shell>
 */
       const shell = async (props) => {
  const {
    command, children, language: lang = 'sh', err = false,
    noTrim = false,
  } = props
  let s, cmd
  if (!command) {
    cmd = children.trim()
    s = await new Promise((r, j) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) return j(error)
        return r(err ? stderr : stdout)
      })
    })
  } else {
    const a = children.trim().split('\n').map(c => {
      return c.trim()
    })
    const p = spawn(command, a)
    const { stdout, stderr } = await p.promise
    s = err ? stderr : stdout
    cmd = command + ' ' + a.map(aa => {
      if (/ /.test(aa)) return `"${aa}"`
      return aa
    }).join(' ')
  }
  const CMD = codeSurround(`$ ${cmd}`, 'sh')
  const t = noTrim ? s : s.trim()
  const r = t.replace(/\033\[.*?m/g, '')
  const output = codeSurround(r, lang)
  return `\n${CMD}\n\n${output}\n`
}

/* documentary types/components/shell.xml */
/**
 * @typedef {Object} ShellProps Options for the Shell component. TODO: pass options.
 * @prop {string} [command] The command to execute using the `child_process`. If the command is not passed, the children will be used to pass to `exec`, e.g., `(echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume.js`.
 * @prop {string} [language="sh"] The markdown language of the output. Default `sh`.
 * @prop {boolean} [err=false] Whether to print SDTERR instead of STDOUT (todo: make print both). Default `false`.
 * @prop {string} [children] The arguments to the program each on new line.
 * @prop {boolean} [noTrim=false] Whether to disable trim before printing the output. Default `false`.
 */


module.exports.shell = shell