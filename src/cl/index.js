import { readFileSync, writeFileSync } from 'fs'
import { askSingle } from 'reloquent'

const PATH = 'CHANGELOG.md'

;(async () => {
  const r = /** @type {string} */ (readFileSync('package.json', 'utf8'))
  const { 'version': version, 'repository': repository } = JSON.parse(r)
  let { 'url': git } = repository
  git = git.replace(/^git:\/\//, 'https://').replace(/\.git$/, '')

  const next = await askSingle(`What is the next version after ${version}?`)
  const current = readFileSync(PATH, 'utf8')
  const d = new Date()
  const m = d.toLocaleString('en-GB', { month: 'long' })
  const dd = `${d.getDate()} ${m} ${d.getFullYear()}`
  const heading = `## ${dd}`
  const t = `${heading}

### [${next}](${git}/compare/v${version}...v${next})

${current.startsWith(heading) ? current.replace(`${heading}\n\n`, '') : current}`
  writeFileSync(PATH, t)
})()