import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { User } from './pages/User'
import { Error } from './pages/Error'
import { Protector } from './pages/protector'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path=''
          element={
            <Protector>
              <Home />
            </Protector>
          }
        />
        <Route path='/user' element={<User />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
