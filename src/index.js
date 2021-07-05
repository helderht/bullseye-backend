if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const {SSL_OP_NO_TICKET} = require('constants')
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
  console.log(socket.id, ': conectado')
  // join to rooms
  socket.on('join-rooms', ({client, rooms}) => {
    if (rooms.length > 0) {
      for (const room of rooms) {
        socket.join(room)
        // io.to(room).emit('joined-rooms', {msg: `${client.name} se ha unido a ${room}`})
      }
    }
  })
  // project add - join to room
  socket.on('project-add', ({room}) => {
    socket.join(room)
  })
  // project update
  socket.on('project-update', ({room}) => {
    socket.broadcast.to(room).emit('update-notifications', {msg: 'proyecto actualizado'})
  })
  // project remove

  // collaboration join
  socket.on('collaboration-join', ({room}) => {
    socket.join(room)
    socket.broadcast.to(room).emit('update-notifications', {msg: 'colaborador unido'})
  })
  // collaboration leave

  // estimate add
  socket.on('estimate-add', ({room}) => {
    socket.broadcast.to(room).emit('update-notifications', {msg: 'estimación creada'})
  })
  // estimate update
  // estimate remove

  // snapshot add
  // sanpshot update
  // sanpshot remove

  // poker join
  // poker leave
  // poker message
  // poker card
  // poker next
  // poker previous
  // poker confirm
  // poker undo
  // poker refresh
})

// run
server.listen(app.get('port'), () => {
  console.log('API run')
})
