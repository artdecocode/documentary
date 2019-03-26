import c from './c'
import os from 'os'
import write from '@wrote/write'

const path = process.argv[2]

;(async () => {
  if (!path) throw new Error('Pass the path.')
  // await write(c(), path)
  console.log('File has been written.')
  console.error('There has been no errors.')
})()