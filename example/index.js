const { resolve } = require('path')
require('alamode')()

const p = resolve(__dirname, '..', process.argv[2])
require(p)