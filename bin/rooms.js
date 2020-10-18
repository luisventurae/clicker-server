let rooms = []

const load = (socket, io) => {
    joinRoom(socket, io)
    setPosition(socket, io)
    leavePlayer(socket, io)
}

const joinRoom = (socket, io) => {
    socket.on('server:join:room', (payload) => {
        let room = rooms.find(r => r.room)
        if( !room ) {
            room = {
                room: payload.room,
                players: [],
            }
            rooms.push(room)
            console.log(`sala creada: room_${payload.room}`)
        }
        socket.join(`room_${payload.room}`)
        socket.broadcast.to(`room_${payload.room}`)
                        .emit('client:new:player',payload)
        console.log(`unido a: room${payload.room}`)
        const player = { ...payload }
        delete player.room
        room.players.push(player)

        console.log('players',room.players)
        socket.emit('client:room:players', room.players)
    })
}

const setPosition = (socket, io) => {
    socket.on('server:position', (payload) => {
        socket.broadcast.to(`room_${payload.room}`).emit('client:position',payload)
        // console.log(`posicion: `,payload)
    })
}

const leavePlayer = (socket, io) => {
    socket.on('server:leave:player', (payload) => {
        socket.broadcast.to(`room_${payload.room}`).emit('client:leave:player',payload)
        socket.leave(`room_${payload.room}`)
        console.log(`salido de: room_${payload.room}`)
        const room = rooms.find(r => r.room===payload.room)
        if( room ) {
            room.players = room.players.filter(p => p.username!==payload.username)
            if( !room.players.length ) {
                rooms = rooms.filter(r => r.room!==payload.room)
                console.log(`sala eliminada: room_${payload.room}`)
            }
        }
    })
}

module.exports = {
    load,
}