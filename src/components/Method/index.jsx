// import { resolve } from 'path'
import read from '@wrote/read'

export default async function Method({ children, location }) {
  let [child] = children
  if (!child) throw new Error('The source location of the method is not given.')
  child = child.trim()
  // const s = await
  // const file = await read(child)
}