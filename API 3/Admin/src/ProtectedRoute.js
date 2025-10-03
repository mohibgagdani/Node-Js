import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  let token = localStorage.getItem("token")

  if (token !== "5114") {
    alert("Token is not valid or missing!")
    return <Navigate to="/login" /> 
  }

  return children
}

export default ProtectedRoute
