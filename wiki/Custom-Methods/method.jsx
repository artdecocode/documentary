/* start example */
/**
 * A method title for Documentary.
 * @param {Object} opts
 * @param {import('typal/types').Method} opts.method
 */
export const method = ({ method }) => {
  const args = method.args.map(({ name, optional }) => {
    return optional ? `[${name}]` : name
  }).join(', ')
  return `## ${method.name} (${args})`
}
/* end example */

// * @param {import('documentary')} opts.documentary

// or
export default {
  method: method,
  'other-component': otherComponent,
}

// or
export { default as method } from './method'