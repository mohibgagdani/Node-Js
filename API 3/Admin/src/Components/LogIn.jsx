import React, { useState } from 'react'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'

const LogIn = () => {
    let [email , setEmail] = useState("")
    let [password , setPassword] = useState("")
    let navigate = useNavigate()
    let handleLogIn = (()=>{
        
        let signupData = JSON.parse(localStorage.getItem("users"))
        axios.post("http://localhost:8080/login",{email,password , signupData})
            .then((res)=>{
                alert(res.data.message)
                if(res.data.message === "user logged in !"){
                    let token = Math.floor(Math.random() * 10000)
                    navigate("/user")
                    localStorage.setItem("username",res.data.name)
                    localStorage.setItem("token",token)

                }
            })
            .catch((err)=>{
                console.log(err)
            })
    })
  return (
    <div className="container">
        <h2>Log In</h2>
        <input type="email" placeholder='Email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
        <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
        <button onClick={handleLogIn}>Log In</button>
        <Link className="link" to="/signup">Don't have an account? Sign up</Link>
    </div>
  )
}

export default LogIn
