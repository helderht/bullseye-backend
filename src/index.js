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
  io = socketIO(server, {cors: {origins: process.env.URL_CLIENT}}),
  {user_join, user_leave, get_members} = require('./utilities/help_poker')

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
  socket.on('snapshot-add', ({room}) => {
    socket.broadcast.to(room).emit('update-notifications', {msg: 'snapshot creado'})
  })
  // sanpshot update
  // sanpshot remove

  // poker join
  socket.on('join-poker', ({room, client}) => {
    const member = user_join(room, socket.id, client.name, client.img)
    socket.join(room)
    // info-poker
    io.to(room).emit('info-poker', {members: get_members(room)})
    io.to(room).emit('joined-poker', {msg: `${client.name} se ha unido a ${room}`})
  })
  // poker leave
  socket.on('leave-room', ({room, client}) => {
    socket.leave(room)
    const member = user_leave(socket.id)
    // info-poker
    if (member) io.to(member.room).emit('info-poker', {members: get_members(member.room)})
  })
  // poker refresh
  socket.on('refresh', ({room, stories, pivot, temp_index}) => {
    io.to(room).emit('refreshed', {stories, pivot, temp_index})
  })
  // poker refresh-board
  socket.on('refresh-board', ({room, board}) => {
    io.to(room).emit('update-board', {board})
  })
  // poker message
  socket.on('refresh-messages', ({room}) => {
    io.to(room).emit('upload-messages', {msg: 'cargar mensajes'})
  })
  // disconnect
  socket.on('disconnect', () => {
    const member = user_leave(socket.id)
    // info-poker
    if (member) io.to(member.room).emit('info-poker', {members: get_members(member.room)})
  })
})

// run
server.listen(app.get('port'), () => {
  console.log('API run')
})
