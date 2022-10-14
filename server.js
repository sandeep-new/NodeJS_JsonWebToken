require('dotenv').config()
const express = require("express")
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())

const PORT = 5000

const posts = [
    {
        username: "sandeep",
        title: "Sofware Engineer"
    },
    {
        username: "Rahul",
        title: "Senior Sofware Engineer"
    },
]
const validUsers = ["sandeep", "sandeep1","sandeep2","sandeep3","sandeep3"]

app.get("/posts", tokenAuthenticator, (req,res,next) => {
    //console.log("req.user==>", req.user)
    res.json(posts.filter(post => post.username === req.user.name))
})


function tokenAuthenticator(req,res,next) {
    const authHeader = req.headers['authorization']
    //Bearer token
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_KEY,(err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })


}
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

