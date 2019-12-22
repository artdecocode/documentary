try {
  throw new Error(123)
} catch (er) {
  throw new Error(123)
} finally {
  console.log('ok')
}