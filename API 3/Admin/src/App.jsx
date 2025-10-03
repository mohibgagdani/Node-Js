import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LogIn from './Components/LogIn'
import SignUp from './Components/SignUp'
import User from './Components/User'
import ProtectedRoute from './ProtectedRoute'
import './styles.css'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LogIn />}></Route>
          <Route path='/signup' element={<SignUp />}></Route>
          <Route path='/user' element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
