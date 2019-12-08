import { join } from 'path'
import clone from '@wrote/clone'

const j = (f) => {
  return join('node_modules/competent', f)
}
(async () => {
  await clone(j('src/make-comps/init.js'), 'stdlib')
  await clone(j('src/make-comps/make-io.js'), 'stdlib')
  await clone(j('src/make-comps/start.js'), 'stdlib')
  await clone(j('src/make-comps/start-plain.js'), 'stdlib')
  await clone(j('src/make-comps/preact-proxy.js'), 'stdlib')
  // await clone(j('types/competent.js'), 'internal/externs')
  // await clone(j('types/component.js'), 'internal/externs')
})()