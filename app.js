const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(morgan('common'))

app.get('/', (req, res) => {
  res.send('Hello Express!')
})

app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers!')
})

app.get('/pizza/pepperoni', (req, res) => {
  res.send('Your pizza is on the way!')
})

app.get('/pizza/pineapple', (req, res) => {
  res.send('We dont serve that here. Never call again!')
})

app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
    Base URL: ${req.baseURL}
    Host: ${req.hostname}
    Path: ${req.path}
    Body: ${req.body}
    `
  res.send(responseText)
})

app.get('/queryViewer', (req, res) => {
  console.log(req.query)
  res.end()
})

app.get('/greetings', (req, res) => {
  const name = req.query.name
  const race = req.query.race

  if (!name) {
    return res.status(400).send('Please provide a name')
  }
  if (!race) {
    return res.status(400).send('Please provide a race')
  }

  const greeting = `Greetings ${name} the ${race}, welcome to our family`

  res.send(greeting)
})

app.get('/sum', (req, res) => {
  const a = Number(req.query.a)
  const b = Number(req.query.b)

  if (!a || isNaN(a)) {
    return res.status(400).send('a must be a number')
  }
  if (!b || isNaN(b)) {
    return res.status(400).send('b must be a number')
  }

  const sum = `The Sum of ${a} and ${b} is ${a + b}`

  res.send(sum)
})

app.get('/cipher', (req, res) => {
  const text = req.query.text
  const shift = req.query.shift

  if (!text) {
    return res.status(400).send('text is required')
  }
  if (!shift || Number.isNaN(parseFloat(shift))) {
    return res.status(400).send('shift is required')
  }

  const cipher = text
    .toUpperCase()
    .split('') //create array of characters
    .map(char => { //map each original char to a converted char
      const code = char.charCodeAt(0) //get char code for letter

      if (code < 65 || code > 91) { // if its not A-Z ignore it
        return char
      }

      let diff = code - 65
      diff = diff + parseFloat(shift)

      diff = diff % 26

      const shifted = String.fromCharCode(65 + diff)
      return shifted
    })
    .join('')
  //for each character is text return cipher character and join the text


  res.send(cipher)
})

app.get('/lotto', (req, res) => {
  const { numbers } = req.query
  //test each array value to be a number between 1 and 20 
  if (!numbers) {
    return res.status(400).send('numbers is required')
  }
  if (!Array.isArray(numbers)) {
    return res.status(400).send('numbers must be an array')
  }

  const numbersIn = numbers.map(n => parseInt(n)).filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20))

  if (numbersIn.length != 6) {
    return res.status(400).send('numbers must only have 6 numbers between 1 and 20')
  }

  const winningNumbers = Array(6).fill().map(() => Math.round(Math.random() * 20))

  let diff = winningNumbers.filter(n => !numbersIn.includes(n))

  let response = ''

  switch (diff.length) {
    case 0:
      response = 'Wow! Unbelievable! You could have won the mega millions!'
      break
    case 1:
      response = 'Congratulations! You win $100'
      break
    case 2:
      response = 'Congratulations, you win a free ticket!'
      break
    default:
      response = 'Sorry, you lose'
  }
  
  res.send(response)
})

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!')
})