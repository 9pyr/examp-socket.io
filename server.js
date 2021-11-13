const express = require('express')
const http = require('http')
const next = require('next')
const socketio = require('socket.io')

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

// const { constantValue } = require('./helpers/constant')
const { event_emit } = {
  event_emit: 'reserve',
}

const cache = {}
nextApp.prepare().then(async () => {
  const app = express()
  const server = http.createServer(app)
  const io = new socketio.Server()
  io.attach(server)

  app.get('/hello', async (_, res) => {
    res.send('Hello World')
  })

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

  app.all('*', (req, res) => nextHandler(req, res))

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
