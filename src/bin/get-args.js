import argufy from 'argufy'

const getArgs = () => {
  return argufy({
    source: {
      command: true,
    },
    toc: {
      short: 't',
      boolean: true,
    },
    watch: {
      short: 'w',
      boolean: true,
    },
    output: 'o',
    push: {
      short: 'p',
    },
    typedef: {
      short: 'T',
      boolean: true,
      description: 'Process a JavaScript file to include typedef documentation in their source code. The target file should contain `/* documentary path/to/types.xml */` marker in place where types are to be inserted.',
    },
    version: {
      short: 'v',
      boolean: true,
    },
    extract: {
      short: 'e',
      description: 'Extract @typedef JSDoc comments and place them in a file.',
    },
  })
}

export default getArgs