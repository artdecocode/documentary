/* start example */
/**
 * A method title for Documentary.
 * @param {Object} opts
 * @param {import('typal/types').Method} opts.method
 */
export const method = ({ method, level }) => {
  const hash = '#'.repeat(level)
  const args = method.args.map(({ name, optional }) => {
    return optional ? `[${name}]` : name
  }).join(', ')
  return `${hash} ${method.name} (${args})`
}
/* end example */

// * @param {import('documentary')} opts.documentary

// or
// export default {
//   method: method,
//   'other-component': otherComponent,
// }

// // or
// export { default as method } from './method'