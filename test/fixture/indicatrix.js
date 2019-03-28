import indicatrix from 'indicatrix'

(async () => {
  console.log('Starting the fork')
  await indicatrix('Loading', new Promise((r) => {
    setTimeout(r, 250)
  }), { interval: 75 })
  console.log('Finishing the fork')
})()