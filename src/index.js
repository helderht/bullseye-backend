if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// imports
const http = require('http'),
  path = require('path'),
  express = require('express'),
  socketIO = require('socket.io'),
  cors = require('cors'),
  router = require('./controllers/router')

// database
require('./db/database')

// server
const app = express()
app
  .set('port', process.env.PORT || 3000)
  .use(express.urlencoded({extended: false}))
  .use(express.json())
  .use(cors())
  .use(router)
  .use(express.static(path.join(__dirname, '/public')))

// sockets
const server = http.createServer(app),
  io = socketIO(server, {cors: {origins: process.env.URL_CLIENT}})

io.on('connection', socket => {
  console.log('conectado: ', socket.id)
})

server.listen(app.get('port'), () => {
  console.log('API run: ', app.get('port'))
})
