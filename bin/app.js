const Room = require('./rooms')

const load = (socket, io) => {
    console.log('Escuchando socket ID: ' + socket.id)
    Room.load(socket, io)
}

module.exports = {
    load,
}