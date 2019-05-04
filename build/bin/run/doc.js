const run = require('../run');

/**
 * Returns the list of additional files that were involved, e.g., examples, forks, typedefs.
 */
const doc = async (options) => {
  if (!options.source) {
    throw new Error('Please specify an input file.')
  }
  return await run(options)
}

module.exports=doc