console.log('forking')
if (process.env.INDICATRIX_PLACEHOLDER) {
  console.log('<INDICATRIX_PLACEHOLDER>')
} else {
  console.log('no INDICATRIX_PLACEHOLDER env var')
}