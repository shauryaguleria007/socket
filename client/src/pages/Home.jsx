import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context'
export const Home = () => {
  const navigate = useNavigate()
  const { user, socket, users } = useGlobalContext()

  useEffect(() => {
    socket.auth = { user }
    socket.connect()
  }, [])

  return (
    <div className='chat'>
      <div className='users'>
        {users.map((payload) => {
          return <User key={payload.userId} payload={payload} />
        })}
      </div>
      <Box />
    </div>
  )
}

const User = ({ payload }) => {
  const { socket, setChat } = useGlobalContext()
  const handel = () => {
    setChat(payload)
  }
  return (
    <div className='user' onClick={handel}>
      <p>
        {payload.user}
        <span> online{socket.id === payload.userId ? '  (you)' : ''}</span>
      </p>
    </div>
  )
}

const Box = () => {
  const { socket, chat, sendMessage, setUsers } = useGlobalContext()
  const [message, setMessage] = useState('')

  const handel = (e) => {
    e.preventDefault()
    if (message !== '') {
      sendMessage(message)

      setUsers((prev) => {
        prev.map((obj) => {
          if (obj.userId === chat.userId)
            obj.messages.push({ message, val: 'right' })
        })
        return [...prev]
      })
    }
    setMessage('')
  }

  if (chat === null || chat.userId === socket.id)
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
          return <Message body={obj.message} val={obj.val} key={index} />
        })}
      </div>
      <form action='submit' onSubmit={handel}>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Send</button>
      </form>
    </div>
  )
}

const Message = ({ body, val }) => {
  return <div className={`message ${val}`}>{body}</div>
}
