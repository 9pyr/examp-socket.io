import React, { useEffect, useRef, useState } from 'react'
import { Container, ListHorizontal, Button } from 'components/styles/styles.js'
import { joinSocket, disconnectSocket, selectRoom, sendValue, getBuilding, switchRooms } from 'actions/socketIO'

const UserPage = (props) => {
  const { userId } = props
  const prevRoom = useRef()
  const [values, setValues] = useState(initialValue)

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
      if (prevRoom.current) {
        console.log({ prevRoom: prevRoom.current, nextRoom: values.building })
        switchRooms(prevRoom.current, values.building)
      } else {
        joinSocket(values.building)
      }
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
          onChange={(event) => {
            console.log('🔥 select')
            prevRoom.current = values.building
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
const initialValue = { building: buildingValue[0].value }
