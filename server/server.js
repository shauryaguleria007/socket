const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { InMemorySessionStore } = require('./sessionStore')
const { InMemoryMessageStore } = require('./messageStore')
const app = express()
const crypto = require('crypto')
const randomId = () => crypto.randomBytes(8).toString('hex')
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
})
const sessionStore = new InMemorySessionStore()
const messageStore = new InMemoryMessageStore()
app.all('*', (req, res) => res.send('<h1>not found</h1>'))

io.use((socket, next) => {
  const sessionId = socket.handshake.auth.sessionId
  if (sessionId) {
    const session = sessionStore.findSession(sessionId)
    if (session) {
      socket.sessionId = sessionId
      socket.userId = session.userId
      socket.user = session.user
      return next()
    }
  }
  //user
  const user = socket.handshake.auth.user
  if (!user) return next(new Error('invalid user'))

  socket.sessionId = randomId()
  socket.userId = randomId()
  socket.user = user
  sessionStore.saveSession(socket.sessionId, {
    userId: socket.userId,
    user: socket.user,
  })
  next()
})

io.on('connection', (socket) => {
  const users = []
  console.log(`${socket.id} connected user:${socket.user}`)
  const messagesForUser = new Map()

  messageStore.findMessagesForUser(socket.userId).forEach((message) => {
    const { from, to } = message
    const otherUser = socket.userID === from ? to : from

    if (messagesForUser.has(otherUser))
      messagesForUser.get(otherUser).push(message)
    else messagesForUser.set(otherUser, [message])
  })

  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      user: session.user,
      userId: session.userId,
      messages: messagesForUser.get(session.userId) || [],
    })
  })
  console.log(messagesForUser, users)
  // for (let [id, socket] of io.of('/').sockets) {
  //   users.push({
  //     user: socket.user,
  //     userId: socket.userId,
  //     messages: [],
  //   })
  // }
  socket.join(socket.userId)
  socket.emit('session', {
    sessionId: socket.sessionId,
    userId: socket.userId,
    user: socket.user,
  })
  socket.emit('users', users)

  socket.broadcast.emit('connected', {
    user: socket.user,
    userId: socket.userId,
    messages: [],
  })

  socket.on('disconnect', async () => {})

  socket.on('private', ({ body, to }) => {
    messageStore.saveMessage({ body, from: socket.userId, to })
    socket.to(to).emit('recieveP', {
      body,
      from: socket.userId,
    })
  })
})

server.listen(3000, () => {
  console.log('server connected ')
})
