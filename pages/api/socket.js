const { constantValue } = require('../../helpers/constant')
const { Server } = require('socket.io')

const { event_emit } = constantValue || {}

const cache = {}
export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)

    io.on('connection', (socket) => {
      console.log(`🔥 => Connected: ${socket.id}`)

      socket.on('disconnect', () => console.log(`🔥 => Disconnected: ${socket.id}`))

      socket.on('join', (building) => {
        console.log(`🔥 => Socket ${socket.id} joining ${building}`)
        socket.join(building)
      })

      socket.on('switch', (data) => {
        const { prevRoom, nextRoom } = data
        if (prevRoom) socket.leave(prevRoom)
        if (nextRoom) {
          console.log(`🔥 => Socket ${socket.id} joining ${nextRoom}`)

          socket.join(nextRoom)
        }
      })

      socket.on(event_emit, (data) => {
        const { building, room = {} } = data
        const { userId, room_id } = room

        if (!cache[building]) {
          cache[building] = { room: { [userId]: room_id } }
        } else {
          Object.assign(cache[building].room, { [userId]: room_id })
        }

        io.to(building).emit(event_emit, cache[building])
      })

      socket.on('cache', (data) => {
        const { building } = data

        console.log(`🔥 => cache[${building}]:`, cache)
        io.to(building).emit(event_emit, cache[building] || {})
      })
    })

    res.socket.server.io = io
  }
  res.end()
}
