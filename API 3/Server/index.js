const express = require("express")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

let users = []
let token = null 

// Middleware for authentication
function auth(req, res, next) {
    if (token === 5114) {
        next()
    } else {
        res.json({ message: "invalid !" })
    }
}

app.get("/user", auth, (req, res) => {
    res.json({ message: "USER DASH..." })
})

app.post("/login", (req, res) => {
    const { email, password, signupData } = req.body

    let userFound = false
    signupData.map((e) => {
        if (email === e.email && password === e.password) {
            let name = e.name
            token = 5114 
            userFound = true
            return res.json({ message: "user logged in !", name, token })
        }
    })

    if (!userFound) {
        res.json({ message: "invalid !" })
    }
})

app.post("/signup", (req, res) => {
    const { name, email, password } = req.body

    const user = { name, email, password }
    users.push(user)

    res.json({ message: "user created !", users })
})

app.listen(8080, () => {
    console.log("server is running....")
})
