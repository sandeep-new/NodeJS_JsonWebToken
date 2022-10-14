
require('dotenv').config()
const express = require("express")
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())

const PORT = 6000

let refreshTokens = []

app.post("/token", (req,res) => {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401) 
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403) 
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
        if(err) return res.sendStatus(403) 
        const accessToken = generateAccessToken({name:user.name})
        res.json({accessToken : accessToken})
    })
})

app.delete("/logout", (req,res) => {
    refreshTokens = refreshTokens.filter(token=> token != req.body.token)
    res.send("Toekn Deleted")
    res.sendStatus(204)
})

app.post("/login", (req,res,next) => {
    const username = req.body.username
    const user = { name: username }
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY)
    refreshTokens.push(refreshToken)
    res.json( {accessToken : accessToken, refreshToken : refreshToken})
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.TOKEN_KEY, { expiresIn : "60s"})
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

