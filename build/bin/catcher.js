const { debuglog } = require('util');

const LOG = debuglog('doc')
const DEBUG = /doc/.test(process.env.NODE_DEBUG)

const catcher = async (err) => {
  let stack
  let message
  if (err instanceof Error) {
    ({ stack, message } = err)
  } else {
    stack = message = err
  }
  DEBUG ? LOG(stack) : console.log(message)
  process.exit(1)
}

module.exports=catcher

//# sourceMappingURL=catcher.js.map