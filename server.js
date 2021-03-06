// var https = require('https')
var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')

// var createError = require('http-errors')
// var cookieParser = require('cookie-parser')
// var logger = require('morgan')
var mongoose = require('mongoose')
const bodyParser = require('body-parser')
var history = require('connect-history-api-fallback')

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sun-oracle'
mongoose.connect(mongoUri)

require('./backend/models/users');

var authRouter = require('./backend/routes/authRouter')

var app = express()

app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && !req.hostname.includes('localhost')) {
    res.redirect(`https://${req.header('host')}${req.url}`)
  } else {
    next()
  }
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', authRouter)

app.use(serveStatic(path.join(__dirname, 'dist')))
app.use(history())
app.use(serveStatic(path.join(__dirname, 'dist')))

var port = process.env.PORT || 8080

app.listen(port)
console.log('server started ' + port)
