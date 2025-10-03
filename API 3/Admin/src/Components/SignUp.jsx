import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const SignUp = () => {
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")

    let handleSignUp = (() => {
        axios.post("http://localhost:8080/signup", { name, email, password })
            .then((res) => {
                alert(res.data.message)
                localStorage.setItem("users",JSON.stringify(res.data.users))
            })
            .catch((err) => {
                console.log(err)
            })

        setName("")
        setEmail("")
        setPassword("")
    })
    return (
        <div className="container">
            <h2>Sign Up</h2>
            <input type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} value={name} />
            <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} />
            <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} />
            <button onClick={handleSignUp}>Sign Up</button>
            <Link className="link" to="/">Already have an account? Log in</Link>
        </div>
    )
}

export default SignUp
