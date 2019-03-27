const run = require('../run');

const doc = async ({ source, output, justToc = false, h1, reverse }) => {
  if (!source) {
    throw new Error('Please specify an input file.')
  }
  await run({
    source, reverse, output, justToc, h1,
  })
}

module.exports=doc