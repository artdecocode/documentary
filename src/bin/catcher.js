const DEBUG = /doc/.test(process.env.NODE_DEBUG) || process.env.DEBUG

const catcher = async (err) => {
  let stack
  let message
  if (err instanceof Error) {
    ({ stack, message } = err)
  } else {
    stack = message = err
  }
  DEBUG ? console.error(stack) : console.log(message)
  process.exit(1)
}

export default catcher
