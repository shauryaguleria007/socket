import React from 'react'
import { useEffect } from 'react'
import { useGlobalContext } from '../context'
import { useNavigate } from 'react-router-dom'
export const Protector = ({ children }) => {
  const navigate = useNavigate()
  const { user, sessionId, setSessionId } = useGlobalContext()
  const sid = localStorage.getItem('sessionId')
  useEffect(() => {
    if (sid) {
      setSessionId(sid)
      return
    }
    if (user == null) {
      navigate('/user')
      return
    }
  }, [])
  if (user !== null || sessionId !== null) return children
}
