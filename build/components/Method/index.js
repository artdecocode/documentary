const { h } = require('preact');
// import { resolve } from 'path'
const { read } = require('../../../stdlib');

async function Method({ children, location }) {
  let [child] = children
  if (!child) throw new Error('The source location of the method is not given.')
  child = child.trim()
  // const s = await
  // const file = await read(child)
}

module.exports = Method