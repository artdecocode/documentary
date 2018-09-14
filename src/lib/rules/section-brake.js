import ensurePath from '@wrote/ensure-path'
import { join } from 'path'
import { createReadStream, createWriteStream } from 'fs'
import mismatch from 'mismatch'

const sectionBrakeRe = /^%~(?: +(-?\d+))?(?: +(.+))?%$/gm

const rule = {
  re: sectionBrakeRe,
  async replacement(match, number, attrs = '') {
    let n = 0
    if (number) n = parseInt(number)
    else if (this.sectionBrakeNumber !== undefined) n = this.sectionBrakeNumber == 22
      ? 0                           // reset
      : this.sectionBrakeNumber + 1 // increase from the prev one
    const isEnd = n >= 0
    if (isEnd) this.sectionBrakeNumber = n
    const name = `${n}.svg`
    const imgPath = join(__dirname, '../../breaks', name)
    const newPath = getNewPath(name)
    await copy(imgPath, newPath)
    const a = mismatch(/(.+)="(.+)"/gm, attrs, ['key', 'val'])
      .reduce((acc, { key, val }) => ({ ...acc, [key]: val }), {})
    const tags = getTags({ src: newPath, ...a })
    return tags
  },
}

const getTags = ({
  href = '#table-of-contents',
  ...attrs
}) => {
  const a = Object.keys(attrs).map(k => `${k}="${attrs[k]}"`).join(' ')
  const s = `<p align="center"><a href="${href}"><img ${a}></a></p>`
  return s
}

const getNewPath = (name) => {
  const j = join('.documentary', name)
  return j
}

const copy = async (from, newPath) => {
  await ensurePath(newPath)
  const rs = createReadStream(from)
  const ws = createWriteStream(newPath)
  await new Promise((r, rj) => {
    rs.pipe(ws).on('close', r).on('error', rj)
  })
}

export { sectionBrakeRe }
export default rule