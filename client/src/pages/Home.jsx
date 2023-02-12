import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context'
export const Home = () => {
  const navigate = useNavigate()
  const { user, socket, users, sessionId } = useGlobalContext()

  useEffect(() => {
    if (sessionId === null) socket.auth = { user }
    else socket.auth = { sessionId }
    socket.connect()
  }, [])

  return (
    <div className='chat'>
      <div className='users'>
        {users.map((payload, index) => {
          return <User key={index} payload={payload} />
        })}
      </div>
      <Box />
    </div>
  )
}

const User = ({ payload }) => {
  const { user, socket, setChat } = useGlobalContext()
  const handel = () => {
    setChat(payload)
  }
  return (
    <div className='user' onClick={handel}>
      <p>
        {payload.user}
        <span> online{user.user === payload.user ? '  (you)' : ''}</span>
      </p>
    </div>
  )
}

const Box = () => {
  const { socket, chat, user, sendMessage, setUsers } = useGlobalContext()
  const [message, setMessage] = useState('')

  const handel = (e) => {
    e.preventDefault()
    if (message !== '') {
      sendMessage(message)

      setUsers((prev) => {
        prev.map((obj) => {
          if (obj.userId === chat.userId)
            obj.messages.push({ body: message, from: user.userId })
        })
        return [...prev]
      })
    }
    setMessage('')
  }

  if (chat === null || chat.user === user.user)
    return (
      <div className='chatBox'>
        <h1>welcome</h1>
      </div>
    )
  return (
    <div className='chatBox'>
      <div className='send'>
        <h1>{chat.user}</h1>
      </div>
      <div className='messages'>
        {chat.messages?.map((obj, index) => {
          return (
            <Message
              body={obj.body}
              val={obj.from === user.userId ? 'right' : 'left'}
              key={index}
            />
          )
        })}
      </div>
      <form action='submit' onSubmit={handel}>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ borderRadius: '20px' }}
        />
        <button style={{ borderRadius: '20px' }}>Send</button>
      </form>
    </div>
  )
}

const Message = ({ body, val }) => {
  return <div className={`message ${val}`}>{body}</div>
}
