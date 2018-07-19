import { Replaceable } from 'restream'
import typedefJsRule from './rules/typedef-js'

export default function createJsReplaceStream() {
  const s = new Replaceable([
    typedefJsRule,
  ])

  return s
}
