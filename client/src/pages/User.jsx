import React, { useState } from 'react'
import { useGlobalContext } from '../context'
import { useNavigate } from 'react-router-dom'
export const User = () => {
  const navigate = useNavigate()
  const { setUser } = useGlobalContext()
  const [input, setInput] = useState('')
  const handelSubmit = (e) => {
    e.preventDefault()
    setUser(input)
    setInput('')
    navigate('/')
  }
  return (
    <form action='submit' onSubmit={handelSubmit}>
      <label htmlFor=''>Enter user name</label>
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button>Submit</button>
    </form>
  )
}
