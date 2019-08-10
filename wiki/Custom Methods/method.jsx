export const method = ({ documentary, method }) => {
  return `## ${method.name} ()`
}

// or
export default {
  method: method,
  'other-component': otherComponent,
}

// or
export { default as method } from './method'