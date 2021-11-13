import io from 'socket.io-client'
import { socketApi } from 'actions/apis'
import { constantValue } from 'helpers/constant'

const { event_emit } = constantValue

const socket = io(process.env.NEXT_PUBLIC_BASE_URL)

export const joinSocket = (room) => {
  console.log('Joining socket...', room)

  if (socket && room) {
    socket.emit('join', room)
  }
}

export const switchRooms = (prevRoom, nextRoom) => {
  if (socket) socket.emit('switch', { prevRoom, nextRoom })
}

export const disconnectSocket = () => {
  console.log('Disconnecting socket...')

  if (socket) socket.disconnect()
}

export const sendValue = async (callback) => {
  if (!socket) return true

  socket.on(event_emit, (data) => {
    return callback(null, data)
  })
  // await socketApi().then(() => {
  //   socket.on(event_emit, (data) => {
  //     return callback(null, data)
  //   })
  // })
}

export const selectRoom = (building, room) => {
  if (socket) socket.emit(event_emit, { building, room })
}

export const getBuilding = async (building) => {
  if (socket) socket.emit('cache', { building })
}
