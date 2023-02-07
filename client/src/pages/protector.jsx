import React from 'react'
import { useEffect } from 'react'
import { useGlobalContext } from '../context'
import { useNavigate } from 'react-router-dom'
export const Protector = ({ children }) => {
  const navigate = useNavigate()
  const { user } = useGlobalContext()
  useEffect(() => {
    if (user == null) {
      navigate('/user')
      return
    }
  }, [])
  if (user !== null) return children
}
