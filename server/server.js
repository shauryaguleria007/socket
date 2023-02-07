const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { InMemorySessionStore } = require('./sessionStore')
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
})
const sessionStore = new InMemorySessionStore()
app.all('*', (req, res) => res.send('<h1>not found</h1>'))

io.use((socket, next) => {
  const sessionId = socket.handshake.auth.sessionId
  //user
  const user = socket.handshake.auth.user
  if (!user) return next(new Error('invalid user'))
  socket.user = user
  next()
})

io.on('connection', (socket) => {
  const users = []
  socket.on('disconnect', () => {
    socket.broadcast.emit('disconnected', {
      userId: socket.id,
      user: socket.user,
    })
  })
  console.log(`${socket.id} connected user:${socket.user}`)

  for (let [id, socket] of io.of('/').sockets) {
    users.push({
      userId: id,
      user: socket.user,
      messages: [],
    })
  }

  socket.on('private', ({ body, to }) => {
    socket.to(to).emit('recieveP', {
      body,
      from: socket.id,
    })
  })

  socket.emit('users', users)
  socket.broadcast.emit('connected', {
    userId: socket.id,
    user: socket.user,
    messages: [],
  })
})

server.listen(3000, () => {
  console.log('server connected ')
})
