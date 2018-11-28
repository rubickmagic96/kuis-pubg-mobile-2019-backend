const express = require('express')

const port = process.env.PORT || 3000
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'pug')

const test = require('./routes/test')
const kuis = require('./routes/kuis')

app.use('/testing/', test)
app.use('/kuis/', kuis)

app.get('/', (req, res) => {
    res.render('index', {title: 'selamat datang bung', message: 'lagi ngapain?'})
})

app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready On Server http://localhost:${port}`)
})