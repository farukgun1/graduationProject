//npm packages
const express = require('express')
const connectDB = require('./db/connect')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const path = require('path')
const fs = require('fs')

const app = express()

// ✅ JSON parse işlemleri en üste taşındı
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 🔐 Güvenlik, statik dosya, cors, sanitize middleware'leri
app.use(cors())
app.use(mongoSanitize())
// app.use(compression())
// app.use(helmet())
// app.use(cookieParser())

// 🔧 Statik dosyalar
app.use(express.static('public'))
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use(express.static(path.join(__dirname, 'front')))
app.use(express.static(path.join(__dirname, 'front', 'template')))
app.use(express.static(path.join(__dirname, 'front', 'template', 'pages')))

// 🌍 Ortama göre .env dosyası
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
require('dotenv').config({ path: envFile })

// 🔨 Sayfa yönlendirme ve yükleme işlemleri
const pagesConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'pages.json'), 'utf-8'),
)

app.get('', (req, res) => {
  res.redirect('login')
})

app.get('/login', (req, res) => {
  console.log(path.join(__dirname, 'front', 'template', 'pages', 'index.html'))
  res.sendFile(path.join(__dirname, 'front', 'template', 'pages', 'index.html'))
})

app.get('/:page', (req, res) => {
  const page = req.params.page
  console.log('hii', page)

  let fileName = pagesConfig[page]
  if (fileName) {
    res.sendFile(path.join(__dirname, 'front', 'template', 'pages', fileName))
  } else {
    res.status(404).send('Page not found')
  }
})

// 🧩 Rotalar
const handlerMiddleware = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')
const { initRoutes } = require('./routes/index')
initRoutes(app)

app.use(notFound)
app.use(handlerMiddleware)

const PORT = process.env.PORT || 5000
connectDB()

module.exports = { app, PORT }
