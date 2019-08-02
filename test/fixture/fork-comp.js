import askQuestions from 'reloquent'
import { createInterface } from 'readline'

(async () => {
  const res = await askQuestions({
    'a': 'Are you sure?',
    'b': 'Please confirm',
  })
  console.log(res)
  const i = createInterface({
    input: process.stdin,
    output: process.stderr,
  })
  i.question('STDERR question: ', (answer) => {
    console.log(answer)
    i.close()
    process.exit()
  })
})()