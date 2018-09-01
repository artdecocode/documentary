#!/usr/bin/env node
const { watch } = require('fs');
const { debuglog } = require('util');
const { lstatSync } = require('fs');
let run = require('./run'); if (run && run.__esModule) run = run.default;
let getArgs = require('./get-args'); if (getArgs && getArgs.__esModule) getArgs = getArgs.default;
let generateTypedef = require('./run/generate'); if (generateTypedef && generateTypedef.__esModule) generateTypedef = generateTypedef.default;
let extractTypedef = require('./run/extract'); if (extractTypedef && extractTypedef.__esModule) extractTypedef = extractTypedef.default;
const { version } = require('../../package.json');
let catcher = require('./catcher'); if (catcher && catcher.__esModule) catcher = catcher.default;
const { getStream, gitPush } = require('../lib');

const LOG = debuglog('doc')
const DEBUG = /doc/.test(process.env.NODE_DEBUG)

const {
  source: _source,
  output: _output,
  toc: _toc,
  watch: _watch,
  push: _push,
  version: _version,
  extract: _extract,
} = getArgs()

let {
  generate: _generate,
  _argv,
} = getArgs()

if (_version) {
  console.log(version)
  process.exit(0)
}

if (process.argv.find(a => a == '-p') && !_push) {
  catcher('Please specify a commit message.')
}
if (process.argv.find(a => a == '-e') && !_extract) {
  catcher('Please specify where to extract typedefs (- for stdout).')
}

if (_argv.find(g => g == '-g') && !_generate) {
  _generate = _source
}

if (_source) {
  try {
    lstatSync(_source)
  } catch (err) {
    if (err.message) err.message = `Could not read input ${_source}: ${err.message}`
    catcher(err)
  }
}

const doc = async (source, output, justToc = false) => {
  if (!source) {
    throw new Error('Please specify an input file.')
  }
  const stream = getStream(source)
  await run(stream, output, justToc)
}

(async () => {
  if (_extract) {
    await extractTypedef({
      source: _source,
      destination: _extract,
    })
    return
  }
  if (_generate) {
    await generateTypedef({
      source: _source,
      destination: _generate,
    })
    return
  }
  try {
    await doc(_source, _output, _toc)
  } catch ({ stack, message, code }) {
    DEBUG ? LOG(stack) : console.log(message)
  }

  let debounce = false
  if (_watch || _push) {
    // also watch referenced example files.
    watch(_source, { recursive: true }, async () => {
      if (!debounce) {
        debounce = true
        await doc(_source, _output, _toc)
        if (_push) {
          console.log('Pushing documentation changes.')
          await gitPush(_source, _output, _push)
        }
        debounce = false
      }
    })
  }
})()

//# sourceMappingURL=index.js.map