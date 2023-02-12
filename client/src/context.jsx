import { createContext, useContext, useState, useEffect } from 'react'

import { io } from 'socket.io-client'

const userContext = createContext()

const socket = io('http://localhost:3000', {
  autoConnect: false,
})

export const UserContext = ({ children }) => {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [chat, setChat] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    socket.on('users', (payload) => {
      payload.sort((a, b) => {
        if (a.user === user) return -1
        if (b.user === user) return 1
        if (a.user < b.user) return -1
        a.user > b.user ? 1 : 0
      })
      setUsers(payload)
    })

    socket.on('connected', (payload) => {
      setUsers((prev) => {
        let flag = false
        prev.map((obj) => {
          if (obj.userId === payload.userId) flag = true
        })
        if (flag) return [...prev]

        prev.push(payload)
        prev.sort((a, b) => {
          if (a.user === user) return -1
          if (b.user === user) return 1
          if (a.user < b.user) return -1
          a.user > b.user ? 1 : 0
        })
        return [...prev]
      })
    })

    socket.on('recieveP', ({ body, from }) => {
      setUsers((prev) => {
        prev.map((obj) => {
          if (obj.userId === from) obj.messages.push({ body, from })
        })
        return [...prev]
      })
    })

    socket.on('disconnected', (payload) => {})

    socket.on('session', ({ sessionId, userId, user }) => {
      socket.auth = { sessionId }
      localStorage.setItem('sessionId', sessionId)
      socket.userId = userId
      setUser({ user, userId })
    })
    return () => {
      socket.off('users')
      socket.off('connected')
      socket.off('recieveP')
      socket.off('disconnected')
      socket.off('session')
    }
  }, [user])

  const sendMessage = (body) => {
    socket.emit('private', {
      body,
      to: chat.userId,
    })
  }

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        socket,
        users,
        setUsers,
        chat,
        setChat,
        sendMessage,
        sessionId,
        setSessionId,
      }}
    >
      {children}
    </userContext.Provider>
  )
}

export const useGlobalContext = () => useContext(userContext)
