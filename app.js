//npm packages
const express = require('express')
const connectDB = require('./db/connect')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const app = express()
const path = require('path')
const fs = require('fs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, '/public')))

app.use(express.static(path.join(__dirname, 'front')))
app.use(express.static(path.join(__dirname, 'front', 'template')))
app.use(express.static(path.join(__dirname, 'front', 'template', 'pages')))

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
require('dotenv').config({
  path: envFile,
})

app.use(express.static(path.join(__dirname, 'public')));
const handlerMiddleware = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')
const { initRoutes } = require('./routes/index')
const bodyParser = require('body-parser')
app.use(cors());

// app.use(compression())
// app.use(helmet())
// app.use(cookieParser())
app.use(mongoSanitize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.disable('x-powered-by')

const pagesConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'pages.json'), 'utf-8'));

app.get('', (req, res) => {
  res.redirect('login'); // Ana sayfayı /login'e yönlendir
});

// Login sayfası rotası
app.get('/login', (req, res) => {


 
  console.log(path.join(__dirname, 'front','template','pages', 'index.html')) 
  res.sendFile(path.join(__dirname, 'front','template','pages', 'index.html')); // Örnek olarak bir login sayfası döndür
});

app.get('/:page', (req, res) => {


  const page = req.params.page;
  console.log("hii", page)

  let fileName = pagesConfig[page];  

  if (fileName) {
    res.sendFile(
      path.join(__dirname, 'front', 'template', 'pages', fileName),
    )

  } else {
    res.status(404).send('Page not found');  // Eğer sayfa bulunamazsa 404 hata mesajı gönder
  }
});


initRoutes(app)
app.use(notFound)
app.use(handlerMiddleware)

const PORT = process.env.PORT || 5000
connectDB()

module.exports = { app, PORT }
