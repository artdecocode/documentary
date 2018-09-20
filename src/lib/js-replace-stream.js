import JSDocumentary from './JSDocumentary'

/** @typedef {import('./typedef/Type').default} Type */

export default function createJsReplaceStream() {
  const s = new JSDocumentary()

  return s
}