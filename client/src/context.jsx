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

  useEffect(() => {
    socket.on('users', (payload) => {
      payload.sort((a, b) => {
        if (a.userId === socket.id) return -1
        if (b.userId === socket.id) return 1
        if (a.user < b.user) return -1
        a.user > b.user ? 1 : 0
      })
      setUsers(payload)
    })

    socket.on('connected', (payload) => {
      setUsers((prev) => {
        prev.push(payload)
        prev.sort((a, b) => {
          if (a.userId === socket.id) return -1
          if (b.userId === socket.id) return 1
          if (a.user < b.user) return -1
          a.user > b.user ? 1 : 0
        })
        return [...prev]
      })
    })

    socket.on('recieveP', ({ body, from }) => {
      // console.log(body, from)
      setUsers((prev) => {
        prev.map((obj) => {
          if (obj.userId === from)
            obj.messages.push({ message: body, val: 'left' })
        })
        return [...prev]
      })
    })

    socket.on('disconnected', (payload) => {
      setUsers((prev) => {
        prev = prev.filter((obj) => obj.userId != payload.userId)
        return [...prev]
      })
    })
  }, [])

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
      }}
    >
      {children}
    </userContext.Provider>
  )
}

export const useGlobalContext = () => useContext(userContext)
