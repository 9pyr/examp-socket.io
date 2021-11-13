import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Container, ListHorizontal, Button } from 'components/styles/styles.js'
import { joinSocket, disconnectSocket, selectRoom, sendValue, getBuilding, switchRooms } from 'actions/socketIO'

const UserRender = (props) => {
  const { userId } = props

  const prevRoom = localStorage.getItem(userId)
  const [values, setValues] = useState({ building: localStorage.getItem(userId) || buildingValue[0].value })

  console.log('prevRoom => ', prevRoom)
  console.log('values => ', values)
   console.log('localStorage => ', localStorage.getItem(userId))

  const handleValues = (event, $value) => {
    if (typeof event === 'object' && !Array.isArray(event)) {
      const { name, value } = event.target || {}
      setValues((prev) => ({ ...prev, [name]: value }))
    } else if (typeof event === 'string') {
      setValues((prev) => ({ ...prev, [event]: $value }))
    }
  }

  useEffect(() => {
    if (values.building) {
      if (prevRoom) {
        console.log({ prevRoom: prevRoom, nextRoom: values.building })
        switchRooms(prevRoom, values.building)
      } else {
        joinSocket(values.building)
      }
      localStorage.setItem(userId, values.building)
      getBuilding(values.building)
    }

    handleValues('room', {})
  }, [values.building])

  useEffect(() => {
    sendValue((err, data) => {
      console.log('data => ', data)

      if (!err) handleValues('room', data.room)
    })

    return () => {
      disconnectSocket()
    }
  }, [])

  return (
    <Container>
      userId: {userId}
      <div>
        อาคาร:{' '}
        <select
          name='building'
          value={values.building}
          onChange={(event) => {
            console.log('🔥 select')
            handleValues(event)
          }}
        >
          {buildingValue.map((item, i) => (
            <option key={i} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <ListHorizontal>
        {roomValue.map((item, i) => {
          const { building, room: roomList = {} } = values || {}
          const status = roomList[userId] === item ? 'alert' : Object.entries(roomList).some(([key, value]) => item === value) ? 'active' : ''
          const room = { room_id: item, userId: userId }

          return (
            <div key={i} style={status === 'active' ? { cursor: 'not-allowed' } : {}}>
              <Button
                onClick={() => {
                  console.log('🔥 Click', { building, room })

                  selectRoom(building, room)
                }}
                status={status}
              >
                {item}
              </Button>
            </div>
          )
        })}
      </ListHorizontal>
    </Container>
  )
}

const UserPage = dynamic(() => Promise.resolve(UserRender), { ssr: false })

UserPage.getInitialProps = async (ctx) => {
  const { userId } = ctx.query || {}
  return { userId }
}

export default UserPage

const roomValue = ['r1', 'r2', 'r3', 'r4', 'r5']
const buildingValue = [
  { label: 'เรียนรวม 1', value: 's1' },
  { label: 'เรียนรวม 2', value: 's2' },
  { label: 'เรียนรวม 3', value: 's3' },
]
