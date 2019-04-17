import run from '../run'

const doc = async (options) => {
  if (!options.source) {
    throw new Error('Please specify an input file.')
  }
  await run(options)
}

export default doc