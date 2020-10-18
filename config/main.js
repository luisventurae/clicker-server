const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const cors = require('cors')
const appio = require('../bin/app')

const APP_HOST = process.env.APP_HOST
const APP_PORT = process.env.APP_PORT

app.use(cors({ origin: () => true }))

// io.origins('http://192.168.20.101:8080')
// io.on('connection', appio)
io.on('connection', socket => {
    appio.load(socket, io)
})

server.listen(APP_PORT, () => {
    console.log(`Running: ${APP_HOST}:${APP_PORT}`)
})